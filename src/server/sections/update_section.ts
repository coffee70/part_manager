'use server'
import client from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Section } from "@/types/collections"
import { z } from "zod"

type Input = {
    _id: string;
    section: Partial<Section>;
}

export async function updateSection(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id, section } = data
    const db = client.db('test')
    const sections = db.collection<Section>('sections')
    const result = await sections.updateOne(
        {
            _id: new ObjectId(_id)
        },
        {
            $set: section
        }
    )
    return result
}