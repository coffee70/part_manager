'use server'
import prisma from "@/lib/database/prisma";
import { FieldModel, Prisma } from "@prisma/client";

export async function getFields(model: FieldModel) {
    const sections = await prisma.section.findMany({
        where: {
            model
        },
        include: {
            fields: true
        }
    })

    return sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
            ...field,
            default: validator(field.default)
        }))
    }))
} 

function validator(value: Prisma.JsonValue): string | number | boolean | any[] | null | never {
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (value === null) {
        return value;
    }
    if (typeof value === 'object') {
        throw new Error('Objects are not allowed');
    }
    // This line should never be reached
    throw new Error('Invalid type');
}