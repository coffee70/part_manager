'use server'

import { ActionState, validate } from "@/lib/validators/server_actions"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db"
import { SectionDoc } from "@/types/collections"
import { ObjectId } from "mongodb"

const InputSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, { message: "Section title is required."}),
})

export async function updateSectionName(input: z.infer<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' }

    const validation = validate(InputSchema, input)
    if (!validation.success) return validation

    const { _id, name } = validation.data

    const sections = db.collection<SectionDoc>('sections')

    await sections.updateOne(
        {
            _id: new ObjectId(_id)
        },
        {
            $set: { name }
        }
    )

    return { success: true }
}