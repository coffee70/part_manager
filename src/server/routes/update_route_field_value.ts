'use server'
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
import { Valuable } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
    stepId: z.string().nullable().optional(),
    fieldId: z.string(),
    value: z.union([
        z.string(),
        z.array(z.string()),
        z.record(z.string(), z.union([z.string(), z.undefined()]))
    ]).optional(),
})

export async function updateRouteFieldValue(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, stepId, fieldId, value } = InputSchema.parse(input)

    if (!instanceId) throw new Error('Cannot update field value without an instance id')
    if (!stepId) throw new Error('Cannot update field value without a step id')
    if (!value) return

    const instanceCollection = db.collection<Valuable>(modelId)

    // Update the value in the node's values object
    await instanceCollection.updateOne(
        { 
            _id: new ObjectId(instanceId),
            "route.nodes.id": stepId
        }, 
        { 
            $set: { 
                [`route.nodes.$.values.${fieldId}`]: value,
                updatedAt: new Date(),
                updatedById: user._id
            }
        }
    );
}