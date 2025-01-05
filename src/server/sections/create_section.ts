'use server'
import { db } from "@/lib/db"
import { SectionDoc } from "@/types/collections";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { WithoutId } from "mongodb";

const InputSchema = z.object({
    name: z.string(),
    modelId: z.string().nullable().optional(),
})

export async function createSection(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { name, modelId } = InputSchema.parse(input)

    if (!modelId) throw new Error('Model ID is required')

    const sections = db.collection<WithoutId<SectionDoc>>('sections')
    await sections.insertOne({
        name,
        modelId,
    })
}