'use server'
import client from "@/lib/mongo/db"
import { Section } from "@/types/collections";
import { z } from "zod";

type Input = {
    section: Section;
}

export async function createSection(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { section } = data
    const db = client.db('test')
    const sections = db.collection<Section>('sections')
    await sections.insertOne(section)
}