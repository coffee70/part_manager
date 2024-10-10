'use server'
import client from "@/lib/mongo/db"
import { Create, Section } from "@/types/collections";
import { z } from "zod";

type Input = {
    section: Create<Section>;
}

export async function createSection(input: Input) {
    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { section } = data
    const db = client.db('test')
    const sections = db.collection('sections')
    await sections.insertOne(section)
}