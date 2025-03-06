'use server'
import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";
import { ActionState, validate } from "@/lib/validators/server_actions";

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    number: z.string().min(1, { message: 'Number is required.' })
})

export async function updateNumber(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) return { success: false, error: 'Unauthorized!' }

    const validation = validate(InputSchema, input)
    if (!validation.success) return validation

    const { id, instanceId, number } = validation.data
    if (!instanceId) return { success: false, error: 'Instance ID is required.' }
    
    const instanceCollection = db.collection<InstanceDoc>(id)

    await instanceCollection.updateOne({ 
        _id: new ObjectId(instanceId) 
    }, { 
        $set: { 
            number,
            updatedAt: new Date(),
            updatedById: user._id
        }
    })

    return { success: true }
}