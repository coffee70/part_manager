'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { RouteState } from "@/types/collections";

const InputSchema = z.object({
  targetModelId: z.string(),
  targetInstanceId: z.string().nullable(),
  sourceModelId: z.string(),
  sourceInstanceId: z.string(),
});

const OutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

/**
 * Clones a route from a source instance to a target instance
 */
export async function upsertRouteFromCloneView(input: z.input<typeof InputSchema>) {
  try {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { targetModelId, targetInstanceId, sourceModelId, sourceInstanceId } = InputSchema.parse(input);

    if (!targetModelId || !targetInstanceId || !sourceModelId || !sourceInstanceId) {
      return OutputSchema.parse({
        success: false,
        error: "Missing required fields"
      });
    }

    // Get the source instance to get its route
    const sourceCollection = db.collection<InstanceDoc>(sourceModelId);
    const sourceInstance = await sourceCollection.findOne({
      _id: new ObjectId(sourceInstanceId)
    }, {
      projection: { route: 1 }
    });

    if (!sourceInstance || !sourceInstance.route) {
      return OutputSchema.parse({
        success: false,
        error: "Source instance does not have a route"
      });
    }

    // Get the target instance
    const targetCollection = db.collection<InstanceDoc>(targetModelId);
    const targetInstance = await targetCollection.findOne({
      _id: new ObjectId(targetInstanceId)
    });

    if (!targetInstance) {
      return OutputSchema.parse({
        success: false,
        error: "Target instance not found"
      });
    }

    // Update the target instance with the cloned route
    const result = await targetCollection.updateOne(
      { _id: new ObjectId(targetInstanceId) },
      {
        $set: {
          route: {
            ...sourceInstance.route,
            state: RouteState.Stopped,
            currentStepId: null
          },
          updatedAt: new Date(),
          updatedById: user._id
        }
      }
    );

    if (result.modifiedCount === 0) {
      return OutputSchema.parse({
        success: false,
        error: "Failed to update target instance"
      });
    }

    return OutputSchema.parse({
      success: true
    });
  } catch (error) {
    console.error("Error cloning route:", error);
    return OutputSchema.parse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
} 