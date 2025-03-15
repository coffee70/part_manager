'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
  modelId: z.string(),
  instanceId: z.string().nullable(),
});

/**
 * Checks if an instance has a route.
 * 
 * @param input The modelId and instanceId to check
 * @returns A boolean indicating whether the instance has a route
 */
export async function hasRoute(input: z.input<typeof InputSchema>): Promise<boolean> {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const { modelId, instanceId } = InputSchema.parse(input);
  if (!modelId) return false;
  if (!instanceId) return false;

  // Get the model instance to check if it has a route
  try {
    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ 
      _id: new ObjectId(instanceId) 
    }, {
      projection: { route: 1 } // Only retrieve the route field for efficiency
    });
    
    // If instance doesn't exist, it doesn't have a route
    if (!instance) return false;
    
    // Check if the route exists and is properly populated with required fields
    return !!(instance.route && 
      instance.route.routerId && 
      instance.route.currentStepId && 
      instance.route.nodes && 
      instance.route.nodes.length > 0);
  } catch (error) {
    console.error("Error checking if instance has route:", error);
    return false;
  }
} 