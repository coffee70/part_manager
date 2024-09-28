'use server'
import client from "@/lib/mongo/db"
import { Section, SectionCollection } from "@/types/collections";
import { getFields } from "@/server/fields/get_fields";
import { z } from "zod";

type Input = {
    collection: SectionCollection;
}

export async function getSections(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { collection } = data
    const db = client.db('test')
    const sections = db.collection<Section>('sections')
    const result = await sections.find({ collection }).toArray()
    
    const sectionsWithFields = await Promise.all(result.map(async section => ({
        ...section,
        _id: section._id.toString(),
        fields: await getFields({ sectionId: section._id.toString() })
    })))

    return sectionsWithFields
}