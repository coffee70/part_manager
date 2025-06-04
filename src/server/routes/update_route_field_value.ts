'use server'
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
import { Valuable, ValueSchema, KVValueSchema } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
    stepId: z.string().nullable().optional(),
    fieldId: z.string(),
    value: ValueSchema.optional(),
    kv_value: KVValueSchema.optional(),
}).refine((data) => {
    return (data.value !== undefined && data.kv_value === undefined) || 
           (data.value === undefined && data.kv_value !== undefined);
}, {
    message: "Either value or kv_value must be provided, but not both"
});

export async function updateRouteFieldValue(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, stepId, fieldId, value, kv_value } = InputSchema.parse(input)

    if (!instanceId) throw new Error('Cannot update field value without an instance id')
    if (!stepId) throw new Error('Cannot update field value without a step id')
    if (!value && !kv_value) return

    const instanceCollection = db.collection<Valuable>(modelId)

    const updateFields: any = {
        updatedAt: new Date(),
        updatedById: user._id
    };

    if (value !== undefined) {
        updateFields[`route.nodes.$.values.${fieldId}`] = value;
    } else if (kv_value !== undefined) {
        updateFields[`route.nodes.$.kv_values.${fieldId}`] = kv_value;
    }

    // Update the value in the node's values object
    await instanceCollection.updateOne(
        { 
            _id: new ObjectId(instanceId),
            "route.nodes.id": stepId
        }, 
        { 
            $set: updateFields
        }
    );
}