'use server'
import { db } from "@/lib/mongo/db"
import { Field, Section, SectionCollection } from "@/types/collections";
import { getFields } from "@/server/fields/get_fields";
import { validators } from "../validators/validators";

type Output = Array<Section & {
    fields: Field[];
}>;


type Input = {
    collection: SectionCollection;
}

export async function getSections(input: Input) {

    const { collection } = validators.input<Input>(input);
    
    const sectionsCollection = db.collection<Section>('sections')
    const sections = await sectionsCollection.find({ collection }).toArray()

    const fields = await Promise.all(sections.map(async section => ({
        ...section,
        fields: await getFields({ sectionId: section._id.toString() })
    })))

    const serialized = JSON.parse(JSON.stringify(fields))

    // validate the return value
    return validators.output<Output>(serialized);
}