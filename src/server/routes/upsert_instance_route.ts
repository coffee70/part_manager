'use server'
import { z } from "zod";
import { HandlePosition } from "@/components/route_builder/types";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { InstanceDoc, StepType } from "@/types/collections";
import { ObjectId } from "mongodb";
import { START_NODE_ID } from "@/components/route_builder/types";

const InputSchema = z.object({
  modelId: z.string(),
  instanceId: z.string(),
  routerId: z.string(),
  route: z.array(z.object({
    id: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
  })),
});

export async function upsertInstanceRoute(
  input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
  const { user } = await getCurrentSession();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  
  const validation = validate(InputSchema, input);
  if (!validation.success) return validation;

  const { modelId, instanceId, routerId, route } = validation.data;
  
  if (!modelId) return { success: false, error: "Model ID is required" };
  if (!instanceId) return { success: false, error: "Instance ID is required" };
  if (!routerId) return { success: false, error: "Router ID is required" };
  if (!route.length) return { success: false, error: "Route must have at least one edge" };

  // Verify router exists
  const routerCollection = db.collection("routers");
  const router = await routerCollection.findOne({ _id: new ObjectId(routerId) });
  if (!router) return { success: false, error: "Router not found" };

  // Verify instance exists
  const instanceCollection = db.collection<InstanceDoc>(modelId);
  const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
  if (!instance) return { success: false, error: "Instance not found" };

  // Verify all instances exist in the router collection
  const routerInstanceCollection = db.collection<InstanceDoc>(routerId);
  
  // Get unique instance IDs from the route
  const routerInstanceIds = new Set<string>();
  route.forEach(edge => {
    routerInstanceIds.add(edge.sourceId);
    routerInstanceIds.add(edge.targetId);
  });
  
  // Check if all router instances exist
  const routerInstanceIdsArray = Array.from(routerInstanceIds);
  
  // Create a map of instance IDs to their details
  const instanceDetailsMap = new Map();
  
  for (const routerInstanceId of routerInstanceIdsArray) {
    const routerInstance = await routerInstanceCollection.findOne({ _id: new ObjectId(routerInstanceId) });
    if (!routerInstance) {
      return { 
        success: false, 
        error: `Router instance with ID ${routerInstanceId} not found` 
      };
    }
    
    // Store instance details for node creation
    instanceDetailsMap.set(routerInstanceId, {
      id: routerInstanceId,
      number: routerInstance.number || 'Unknown'
    });
  }

  // Find the first instance in the route
  // By convention, we'll use the source of the first edge as the first instance
  const firstInstanceId = route.length > 0 ? route[0].sourceId : null;
  
  if (!firstInstanceId) {
    return { success: false, error: "Cannot determine the first instance in the route" };
  }

  // Create the route in the database
  // Convert route to a format that can be stored in the database
  const routeToStore = {
    // Create nodes for each unique instance ID used in the route
    nodes: routerInstanceIdsArray.map(instanceId => ({
      id: instanceId,
      name: instanceDetailsMap.get(instanceId).number,
      type: 'To-do' as StepType, // Using a valid StepType
      x: 0, // Default x position
      y: 0, // Default y position
    })),
    
    // Create a start node with the exact expected type
    startNode: {
      id: START_NODE_ID, // This is now a literal "start" type
      x: 0,
      y: 0,
    },
    
    // Create a start edge that connects the start node to the first instance
    startEdge: {
      id: `${START_NODE_ID}-${firstInstanceId}`,
      sourceId: START_NODE_ID,
      sourcePosition: HandlePosition.BottomMiddle,
      targetId: firstInstanceId,
      targetPosition: HandlePosition.TopMiddle,
      path: "", // This will be calculated on the client
    },
    
    // Convert the simplified edges to the full Edge type, excluding the first edge
    // as it's now handled by startEdge
    edges: route.slice(1).map(edge => ({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
      // Add default values for required properties
      sourcePosition: HandlePosition.BottomMiddle,
      targetPosition: HandlePosition.TopMiddle,
      path: "" // This will be calculated on the client
    }))
  };

  // Store the route with the instance
  await instanceCollection.updateOne(
    { _id: new ObjectId(instanceId) },
    { 
      $set: { 
        routerId: routerId,
        route: routeToStore,
        updatedAt: new Date(),
        updatedById: user._id
      } 
    }
  );

  return { success: true };
} 