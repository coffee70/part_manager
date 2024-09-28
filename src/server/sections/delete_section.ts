'use server'
import client from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Field, Section } from "@/types/collections"
import { z } from "zod"

type Input = {
    _id: string;
}

export async function deleteSection(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id } = data
    const db = client.db('test')
    const sections = db.collection<Section>('sections')
    const fields = db.collection<Field>('fields')
    await fields.deleteMany({ sectionId: _id })
    await sections.deleteOne({ _id: new ObjectId(_id) })
}