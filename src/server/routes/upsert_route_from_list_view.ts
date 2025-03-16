'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { InstanceDoc, stepTypes } from "@/types/collections";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
  modelId: z.string(),
  instanceId: z.string().nullable(),
  route: z.object({
    routerId: z.string(),
    currentStepId: z.string(),
    nodes: z.array(z.object({
      id: z.string(),
      instanceId: z.string(),
      name: z.string(),
      type: z.enum(stepTypes),
    })),
  }),
});

export async function upsertRouteFromListView(
  input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const validation = validate(InputSchema, input);
  if (!validation.success) return validation;

  const { modelId, instanceId, route } = validation.data;

  if (!modelId) return { success: false, error: "Model ID is required" };
  if (!instanceId) return { success: false, error: "Instance ID is required" };
  if (!route.routerId) return { success: false, error: "Router ID is required" };

  // Verify router exists
  const routerCollection = db.collection("routers");
  const router = await routerCollection.findOne({ _id: new ObjectId(route.routerId) });
  if (!router) return { success: false, error: "Router not found" };

  // Verify instance exists
  const instanceCollection = db.collection<InstanceDoc>(modelId);
  const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
  if (!instance) return { success: false, error: "Instance not found" };

  // Verify all instances exist in the router collection
  const routerInstanceCollection = db.collection<InstanceDoc>(route.routerId);

  for (const node of route.nodes) {
    const routerInstance = await routerInstanceCollection.findOne({ _id: new ObjectId(node.instanceId) });
    if (!routerInstance) {
      return {
        success: false,
        error: `Router instance with ID ${node.instanceId} not found`
      };
    }
  }

  // Find the first instance in the route
  // By convention, we'll use the source of the first edge as the first instance
  const firstInstanceId = route.nodes.length > 0 ? route.nodes[0].instanceId : null;

  if (!firstInstanceId) {
    return { success: false, error: "Cannot determine the first instance in the route" };
  }

  // check the current step id is in the route
  let currentStepId = instance.route?.currentStepId;
  if (!currentStepId || !route.nodes.some(node => node.instanceId === currentStepId)) {
    currentStepId = firstInstanceId;
  }

  // Store the route with the instance
  // We no longer need to separately store routerId and stepId as they're part of the route object

  await instanceCollection.updateOne(
    { _id: new ObjectId(instanceId) },
    {
      $set: {
        route: {
          routerId: route.routerId,
          currentStepId: currentStepId,
          nodes: route.nodes
        },
        updatedAt: new Date(),
        updatedById: user._id
      }
    }
  );

  return { success: true };
} 