'use server'
import { ActionState, validate } from "@/lib/validators/server_actions"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc } from "@/types/collections";

const InputSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: 'Name is required.' }),
    routerId: z.string(),
    instanceId: z.string().nullable()
})

export async function upsertRouteFieldsSection(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { _id, name, routerId, instanceId } = input;

    if (!instanceId) {
        // return error
        return { success: false, error: 'Instance ID is required.' };
    }
    
    // Get the collection using the routerId which is the collection name
    const routerInstanceCollection = db.collection<InstanceDoc>(routerId);

    if (_id) {
        // Update existing section
        await routerInstanceCollection.updateOne(
            { 
                _id: new ObjectId(instanceId),
                'route_fields._id': new ObjectId(_id)
            },
            {
                $set: {
                    'route_fields.$.name': name,
                    updatedAt: new Date(),
                    updatedBy: user._id
                }
            }
        );
    } else {
        // Add new section
        await routerInstanceCollection.updateOne(
            { _id: new ObjectId(instanceId) },
            {
                $push: {
                    route_fields: {
                        _id: new ObjectId(),
                        name,
                        fields: []
                    }
                },
                $set: {
                    updatedAt: new Date(),
                    updatedBy: user._id
                }
            }
        );
    }

    return { success: true };
} 