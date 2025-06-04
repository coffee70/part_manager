'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { FieldSchema, InstanceDoc } from "@/types/collections";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

const InputSchema = FieldSchema.extend({
    _id: z.string().optional(),
}).and(z.object({
    routerId: z.string().min(1, { message: 'Router ID is required.' }),
    instanceId: z.string().min(1, { message: 'Instance ID is required.' })
})).refine(data => {
    if (data.type === 'select') {
        if (data.options) return data.options.length > 0;
        else return false;
    }
    else return true;
}, {
    message: 'Select fields must have options.',
    path: ['options']
});

export async function upsertRouteField(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { _id, sectionId, routerId, instanceId, ...fieldData } = validation.data;

    // Get the collection using the routerId which is the collection name
    const routerInstanceCollection = db.collection<InstanceDoc>(routerId);

    if (_id) {
        // Update existing field
        await routerInstanceCollection.updateOne(
            { 
                _id: new ObjectId(instanceId),
                'route_fields._id': new ObjectId(sectionId),
                'route_fields.fields._id': new ObjectId(_id)
            },
            {
                $set: {
                    'route_fields.$[section].fields.$[field]': {
                        _id: new ObjectId(_id),
                        sectionId,
                        ...fieldData
                    },
                    updatedAt: new Date(),
                    updatedBy: user._id
                }
            },
            {
                arrayFilters: [
                    { 'section._id': new ObjectId(sectionId) },
                    { 'field._id': new ObjectId(_id) }
                ]
            }
        );
    } else {
        // Add new field
        await routerInstanceCollection.updateOne(
            { 
                _id: new ObjectId(instanceId),
                'route_fields._id': new ObjectId(sectionId)
            },
            {
                $push: {
                    'route_fields.$.fields': {
                        _id: new ObjectId(),
                        sectionId,
                        ...fieldData
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