'use server'
import { db } from "@/lib/db"
import { contexts, SectionDoc } from "@/types/collections";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { WithoutId } from "mongodb";
import { ActionState, validate } from "@/lib/validators/server_actions";

const InputSchema = z.object({
    name: z.string().min(1, { message: 'Section name is required.' }),
    context: z.enum(contexts),
    id: z.string().nullable().optional(),
})

export async function createSection(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') return { success: false, error: 'Unauthorized' };

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { name, context, id } = validation.data;
    if (!id) return { success: false, error: 'ID is required' }

    const sections = db.collection<WithoutId<SectionDoc>>('sections')
    await sections.insertOne({
        name,
        modelId: context === 'models' ? id : undefined,
        routerId: context === 'routers' ? id : undefined,
    })

    return { success: true }
}

