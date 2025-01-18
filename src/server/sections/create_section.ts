'use server'
import { db } from "@/lib/db"
import { SectionDoc } from "@/types/collections";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { WithoutId } from "mongodb";
import { ActionState, validate } from "@/lib/validators/server_actions";

const InputSchema = z.object({
    name: z.string().min(1, { message: 'Section name is required.' }),
    modelId: z.string().nullable().optional(),
})

export async function createSection(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' };

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { name, modelId } = validation.data;
    if (!modelId) return { success: false, error: 'Model ID is required' }

    const sections = db.collection<WithoutId<SectionDoc>>('sections')
    await sections.insertOne({
        name,
        modelId,
    })

    return { success: true }
}

