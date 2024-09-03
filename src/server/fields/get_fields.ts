'use server'
import { z } from "zod";
import prisma from "@/lib/database/prisma";
import { FieldModel } from "@prisma/client";

// Define the DefaultSchema
const DefaultSchema = z.union([z.string(), z.number()]).nullable();
const OptionsSchema = z.array(z.string()).nullable();

export async function getFields(model: FieldModel) {
    const sections = await prisma.section.findMany({
        where: {
            model
        },
        include: {
            fields: true
        }
    });

    return sections.map(section => ({
        ...section,
        fields: section.fields.map(field => {
            const parsedDefault = DefaultSchema.safeParse(field.default);
            if (!parsedDefault.success) {
                throw new Error(`Invalid default value: ${parsedDefault.error}`);
            }

            const parsedOptions = OptionsSchema.safeParse(field.options);
            if (!parsedOptions.success) {
                throw new Error(`Invalid options value: ${parsedOptions.error}`);
            }

            return {
                ...field,
                default: parsedDefault.data,
                options: parsedOptions.data
            };
        })
    }));
}