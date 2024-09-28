'use server'
import client from "@/lib/mongo/db"
import { Field } from "@/types/collections"
import { z } from "zod"

type Input = {
    sectionId: string;
}

export async function getFields(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { sectionId } = data
    const db = client.db('test')
    const fields = db.collection<Field>('fields')
    const result = await fields.find({ sectionId: sectionId }).toArray()
    return result.map(field => ({
        ...field,
        _id: field._id.toString()
    }))
}
