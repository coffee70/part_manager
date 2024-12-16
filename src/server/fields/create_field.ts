'use server'
import { db } from "@/lib/db"
import { Create, Field } from "@/types/collections"
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    field: Create<Field>;
}

export async function createField(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { field } = data
    
    const fields = db.collection('fields');
    await fields.insertOne(field)
}