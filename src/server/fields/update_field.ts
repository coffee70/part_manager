'use server'
import client from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Field } from "@/types/collections"
import { z } from "zod"

type Input = {
    _id: string;
    field: Partial<Field>;
}

export async function updateField(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id, field } = data
    const db = client.db('test')
    const fields = db.collection('fields')
    await fields.updateOne({ _id: new ObjectId(_id) }, { $set: field })
}