'use server'
import { db } from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { z } from "zod"

type Input = {
    _id: string;
}

export async function deleteField(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id } = data
    
    const fields = db.collection('fields')
    await fields.deleteOne({ _id: new ObjectId(_id) })
}