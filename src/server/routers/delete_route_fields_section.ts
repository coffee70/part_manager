'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc } from "@/types/collections";
import { ActionState, validate } from "@/lib/validators/server_actions";

const InputSchema = z.object({
    modelId: z.string().min(1, { message: 'Model ID is required.' }),
    instanceId: z.string().nullable(),
    sectionId: z.string().min(1, { message: 'Section ID is required.' }),
});

export async function deleteRouteFieldsSection(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, instanceId, sectionId } = validation.data;

    if (!instanceId) throw new Error('Instance ID is required.');
    
    // Get the collection using the modelId which is the collection name
    const collection = db.collection<InstanceDoc>(modelId);

    // Delete the section from route_fields
    await collection.updateOne(
        { _id: new ObjectId(instanceId) },
        {
            $pull: {
                route_fields: { _id: new ObjectId(sectionId) }
            },
            $set: {
                updatedAt: new Date(),
                updatedBy: user._id
            }
        }
    );

    return { success: true };
} 