'use server'
import { db } from "@/lib/db"
import { Create, Section } from "@/types/collections";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    section: Create<Section>;
}

export async function createSection(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { section } = data
    
    const sections = db.collection('sections')
    await sections.insertOne(section)
}