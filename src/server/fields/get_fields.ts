'use server'
import { db } from "@/lib/db"
import { Field } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

type Input = {
    sectionId: string;
}

export async function getFields(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { sectionId } = data
    
    const fields = db.collection<Field>('fields')
    const result = await fields.find({ sectionId: sectionId }).toArray()
    return result.map(field => ({
        ...field,
        _id: field._id.toString()
    }))
}
