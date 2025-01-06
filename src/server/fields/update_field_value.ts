'use server'
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
import { Valuable } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
    fieldId: z.string(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
})

export async function updateFieldValue(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, fieldId, value } = InputSchema.parse(input)

    if (!instanceId) throw new Error('Cannot update field value without a model id')
    if (!value) return

    const instanceCollection = db.collection<Valuable>(modelId)

    await instanceCollection.updateOne(
        { 
            _id: new ObjectId(instanceId) 
        }, 
        { 
            $set: { 
                [`values.${fieldId}`]: value,
                updatedAt: new Date(),
                updatedById: user._id
            }
        }
    );
}