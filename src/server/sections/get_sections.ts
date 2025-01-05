'use server'
import { db } from "@/lib/db"
import { Field, Section } from "@/types/collections";
import { getFields } from "@/server/fields/get_fields";
import { validators } from "../validators/validators";
import { getCurrentSession } from "../auth/get_current_session";

type Output = Array<Section & {
    fields: Field[];
}>;


type Input = {
    modelId?: string | null;
}

export async function getSections(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId } = validators.input<Input>(input);

    if (!modelId) return []
    
    const sectionsCollection = db.collection<Section>('sections')
    const sections = await sectionsCollection.find({ modelId }).toArray()

    const fields = await Promise.all(sections.map(async section => ({
        ...section,
        fields: await getFields({ sectionId: section._id.toString() })
    })))

    const serialized = JSON.parse(JSON.stringify(fields))

    // validate the return value
    return validators.output<Output>(serialized);
}