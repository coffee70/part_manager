'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
});

/**
 * Deletes a route from a model instance
 * 
 * @param input The modelId and instanceId to delete the route from
 * @returns Success status of the operation
 */
export async function deleteRoute(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, instanceId } = validation.data;
    if (!instanceId) return { success: false, error: 'Instance ID is required' };

    try {
        const instanceCollection = db.collection<InstanceDoc>(modelId);
        
        // Get the instance to check if it has a route
        const instance = await instanceCollection.findOne({ 
            _id: new ObjectId(instanceId) 
        });
        
        if (!instance) {
            return { success: false, error: 'Instance not found' };
        }
        
        if (!instance.route) {
            return { success: false, error: 'Instance does not have a route' };
        }
        
        // Remove the route from the instance
        await instanceCollection.updateOne(
            { _id: new ObjectId(instanceId) },
            { 
                $unset: { route: "" },
                $set: { 
                    updatedAt: new Date(),
                    updatedById: user._id
                } 
            }
        );

        return { success: true };
    } catch (error) {
        console.error("Error deleting route:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred while deleting the route' 
        };
    }
} 