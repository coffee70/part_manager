'use server'
import prisma from "@/lib/database/prisma";
import { FieldType, Prisma } from "@prisma/client";
import { z } from "zod";

const FieldSchema = z.object({
    name: z.string(),
    type: z.custom<FieldType>(),
    default: z.union([z.string(), z.array(z.string())]).nullable(),
    options: z.union([z.string(), z.array(z.string())]).nullable(),
    multiple: z.boolean().nullable(),
    creative: z.boolean().nullable(),
    description: z.string(),
    sectionId: z.coerce.number(),
})

export async function createField(formData: FormData) {
    const { data, success, error } = FieldSchema.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
        default: formData.get('default'),
        options: formData.get('options'),
        multiple: formData.get('multiple'),
        creative: formData.get('creative'),
        description: formData.get('description'),
        sectionId: formData.get('sectionId'),
    });

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    const field = await prisma.field.create({ 
        data: {
            name: data.name,
            type: data.type,
            // json fields need to be cast to Prisma.JsonArray
            default: data.default as Prisma.JsonArray,
            options: data.options as Prisma.JsonArray,
            multiple: data.multiple,
            creative: data.creative,
            description: data.description,
            sectionId: data.sectionId,
        }
     });

    return field;
}