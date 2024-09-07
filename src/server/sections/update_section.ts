'use server'
import { z } from "zod"
import { prisma } from "@/lib/database/prisma";
import { SectionModel } from "@prisma/client";

const Schema = z.object({
    id: z.number(),
    title: z.string().optional(),
    model: z.custom<SectionModel>().optional(),
})

export async function updateSection(rawData: z.input<typeof Schema>) {
    // Validate the data using the schema
    const { data, success, error } = Schema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Update the section in the database
    return await prisma.section.update({ where: { id: data.id }, data });
}