'use server'
import { z } from "zod"
import { prisma } from "@/lib/database/prisma";
import { FieldModel } from "@prisma/client";

const Schema = z.object({
    title: z.string(),
    model: z.custom<FieldModel>(),
})

export async function createSection(rawData: z.input<typeof Schema>) {
    // Validate the data using the schema
    const { data, success, error } = Schema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the section in the database
    return await prisma.section.create({ data });
}