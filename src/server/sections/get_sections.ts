'use server'
import { db } from "@/lib/db"
import { contexts, Field, Section, SectionDoc } from "@/types/collections";
import { getFields } from "@/server/fields/get_fields";
import { validators } from "../validators/validators";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

type Output = Array<Section & {
    fields: Field[];
}>;


const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string().nullable().optional(),
})

export async function getSections(input: z.input<typeof InputSchema>): Promise<Output> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id } = InputSchema.parse(input)
    if (!id) return []

    const sectionsCollection = db.collection<SectionDoc>('sections')
    const sections = await sectionsCollection.find({
        [context === 'models' ? 'modelId' : 'routerId']: id
    }).toArray()

    const fields = await Promise.all(sections.map(async section => ({
        ...section,
        fields: await getFields({ sectionId: section._id.toString() })
    })))

    const serialized = JSON.parse(JSON.stringify(fields))

    // validate the return value
    return validators.output<Output>(serialized);
}