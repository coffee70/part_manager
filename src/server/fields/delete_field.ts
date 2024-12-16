'use server'
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

type Input = {
    _id: string;
}

export async function deleteField(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id } = data
    
    const fields = db.collection('fields')
    await fields.deleteOne({ _id: new ObjectId(_id) })
}