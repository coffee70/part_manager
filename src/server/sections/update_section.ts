'use server'
import { db } from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Section } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

type Input = {
    _id: string;
    section: Partial<Section>;
}

export async function updateSection(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { _id, section } = data
    
    const sections = db.collection('sections')
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