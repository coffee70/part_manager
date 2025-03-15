'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getInstance } from "../instances/get_instance";

const InputSchema = z.object({
  modelId: z.string(),
  instanceId: z.string().nullable(),
});

type TargetStep = {
  _id: string;
  id: string;
  number: string;
  routerId: string;
};

/**
 * Determines the next possible steps for a model instance based on its route
 * structure and current step.
 * 
 * @param input The modelId and instanceId to get target steps for
 * @returns A list of router instances that can be the next step
 */
export async function getTargetSteps(input: z.input<typeof InputSchema>): Promise<TargetStep[]> {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const { modelId, instanceId } = InputSchema.parse(input);
  if (!modelId) throw new Error("Model ID is required");
  if (!instanceId) throw new Error("Instance ID is required");

  try {
    // Get the model instance to access its route information
    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ 
      _id: new ObjectId(instanceId) 
    });
    
    if (!instance) {
      throw new Error("Model instance not found");
    }

    // Check if route exists
    if (!instance.route) {
      throw new Error("Model instance does not have a route");
    }
    
    const { routerId, currentStepId, edges } = instance.route;
    
    if (!routerId) {
      throw new Error("Route does not have a router ID");
    }
    
    if (!currentStepId) {
      throw new Error("Route does not have a current step");
    }
    
    if (!edges || !Array.isArray(edges)) {
      return []; // No edges means no target steps
    }

    // Find all edges where the source is the current step
    const targetEdges = edges.filter(edge => edge.sourceId === currentStepId);
    
    // If no target edges, return empty array
    if (targetEdges.length === 0) {
      return [];
    }
    
    // Get unique target IDs
    const targetIds = Array.from(new Set(targetEdges.map(edge => edge.targetId)));
    
    // Fetch all target router instances
    const targetSteps: TargetStep[] = [];
    
    for (const targetId of targetIds) {
      try {
        // Get the router instance
        const routerInstance = await getInstance({
          id: routerId,
          instanceId: targetId
        });
        
        if (routerInstance) {
          targetSteps.push({
            _id: routerInstance._id,
            id: routerInstance._id, // Adding both _id and id for flexibility
            number: routerInstance.number || '',
            routerId
          });
        }
      } catch (error) {
        console.error(`Error fetching target step ${targetId}:`, error);
        // Continue with other steps even if one fails
      }
    }
    
    return targetSteps;
  } catch (error) {
    console.error("Error getting target steps:", error);
    throw new Error("Failed to get target steps");
  }
} 