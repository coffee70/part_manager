'use server'
import client from "@/lib/mongo/db"
import { Create, Field } from "@/types/collections"
import { z } from "zod";

type Input = {
    field: Create<Field>;
}

export async function createField(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { field } = data
    const db = client.db('test')
    const fields = db.collection('fields');
    await fields.insertOne(field)
}