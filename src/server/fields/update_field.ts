'use server'
import { db } from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Field } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

type Input = {
    _id: string;
    field: Partial<Field>;
}

export async function updateField(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id, field } = data
    
    const fields = db.collection('fields')
    await fields.updateOne({ _id: new ObjectId(_id) }, { $set: field })
}