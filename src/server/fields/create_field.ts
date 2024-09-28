'use server'
import client from "@/lib/mongo/db"
import { Field } from "@/types/collections"
import { z } from "zod";

type Input = {
    field: Field;
}

export async function createField(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { field } = data
    const db = client.db('test')
    const fields = db.collection<Field>('fields');
    await fields.insertOne(field)
}