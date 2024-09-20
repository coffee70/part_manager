import prisma from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSections } from "../sections/get_sections";

export const SectionSchema = z.array(z.object({
    sectionId: z.number(),
    fields: z.array(z.object({
        fieldId: z.number(),
        value: z.union([z.string(), z.array(z.string())])
    }))
}))

export async function getCustomerOrder({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    let id = searchParams.id;
    if (Array.isArray(id)) {
        throw new Error("id must be a string");
    }

    const order = await prisma.customerOrder.findFirst({
        where: id ? {
            id: parseInt(id)
        } : undefined,
        include: {
            customer: {
                select: {
                    name: true
                }
            },
            status: {
                select: {
                    label: true,
                    color: true
                }
            },
            customerOrderParts: {
                include: {
                    part: {
                        select: {
                            number: true,
                            status: true,
                        }
                    }
                }
            },
            attachments: true,
        }
    })

    if (order === null) return order

    const { data: sections, success, error } = SectionSchema.safeParse(order.sections)

    if (!success) {
        throw new Error("Error parsing sections: " + error)
    }

    return {
        id: order.id,
        parts: order.customerOrderParts.map((part) => ({
            id: part.id,
            label: part.part.number,
            status: part.part.status
        })),
        customer: order.customer,
        status: order.status,
        number: order.number,
        updatedAt: order.updatedAt,
        notes: order.notes,
        attachments: await Promise.all(order.attachments.map(async (attachment) => ({
            name: attachment.filename,
            url: process.env.FILE_GET_URL + attachment.id
        }))),
        sections: await validateSections(sections)
    };
}

async function validateSections(sections: z.infer<typeof SectionSchema>) {
    const sectionDefintions = await getSections("CUSTOMER_ORDER")

    return sectionDefintions.map(definition => ({
        id: definition.id,
        title: definition.title,
        fields: definition.fields.map(field => ({
            id: field.id,
            name: field.name,
            type: field.type,
            options: field.options,
            multiple: field.multiple,
            creative: field.creative,
            value: sections.find(section => section.sectionId === definition.id)?.fields.find(f => f.fieldId === field.id)?.value
        }))
    }))

}