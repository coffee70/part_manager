'use server'
import prisma from "@/lib/database/prisma";
import { FieldType } from "@prisma/client";
import { z } from "zod";

// Define schemas for each field type
const TextFieldSchema = z.object({
    sectionId: z.number(),
    type: z.literal(FieldType.TEXT),
    name: z.string(),
    default: z.string(),
    description: z.string(),
});

export async function createTextField(rawData: z.input<typeof TextFieldSchema>) {
    // Validate the data using the schema
    const { data, success, error } = TextFieldSchema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the field in the database
    return await prisma.field.create({ data });
}

const NumberFieldSchema = z.object({
    sectionId: z.number(),
    type: z.literal(FieldType.NUMBER),
    name: z.string(),
    default: z.string().transform((val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
    }).optional(),
    description: z.string(),
});

export async function createNumberField(rawData: z.input<typeof NumberFieldSchema>) {
    // Validate the data using the schema
    const { data, success, error } = NumberFieldSchema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the field in the database
    return await prisma.field.create({ data });
}

const DateFieldSchema = z.object({
    sectionId: z.number(),
    type: z.literal(FieldType.DATE),
    name: z.string(),
    description: z.string(),
});

export async function createDateField(rawData: z.input<typeof DateFieldSchema>) {
    // Validate the data using the schema
    const { data, success, error } = DateFieldSchema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the field in the database
    return await prisma.field.create({ data });
}

const TimeFieldSchema = z.object({
    sectionId: z.number(),
    type: z.literal(FieldType.TIME),
    name: z.string(),
    description: z.string(),
});

export async function createTimeField(rawData: z.input<typeof TimeFieldSchema>) {
    // Validate the data using the schema
    const { data, success, error } = TimeFieldSchema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the field in the database
    return await prisma.field.create({ data });
}

const SelectFieldSchema = z.object({
    sectionId: z.number(),
    type: z.literal(FieldType.SELECT),
    name: z.string(),
    options: z.array(z.string()),
    multiple: z.boolean(),
    creative: z.boolean(),
    description: z.string(),
});

export async function createSelectField(rawData: z.input<typeof SelectFieldSchema>) {
    // Validate the data using the schema
    const { data, success, error } = SelectFieldSchema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the field in the database
    return await prisma.field.create({ data });
}

const ParagraphFieldSchema = z.object({
    sectionId: z.number(),
    type: z.literal(FieldType.PARAGRAPH),
    name: z.string(),
    description: z.string(),
});

export async function createParagraphField(rawData: z.input<typeof ParagraphFieldSchema>) {
    // Validate the data using the schema
    const { data, success, error } = ParagraphFieldSchema.safeParse(rawData);

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    // Create the field in the database
    return await prisma.field.create({ data });
}