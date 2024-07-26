import { z } from 'zod';
import { prisma } from '@/lib/database/prisma';

// schemas
const UpdatedAt = z.object({
    to: z.coerce.date(),
    from: z.coerce.date(),
});


export async function getCustomerOrders({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    // build whereObject
    // pull out statusId
    let statusIdJson = searchParams.statusId;
    if (Array.isArray(statusIdJson)) {
        throw new Error("statusId must be a json string");
    }

    let statusId;

    if (statusIdJson) {
        statusId = JSON.parse(statusIdJson);

        const validation = z.array(z.number()).safeParse(statusId);
        if (!validation.success) {
            throw new Error("statusId is not a valid array of numbers");
        } else {
            statusId = validation.data;
        }
    }

    // pull out updatedAt
    // Assuming searchParams is an object where updatedAt is one of the properties
    // and UpdatedAt is a Zod schema for validation

    // Extract updatedAt from searchParams
    let updatedAtJson = searchParams.updatedAt;

    // Check if updatedAtJson is an array, throw an error if true
    if (Array.isArray(updatedAtJson)) {
        throw new Error("updatedAt must be a json string");
    }

    // Initialize a variable to hold the parsed updatedAt object
    let updatedAt;

    // Parse updatedAtJson into an object if it's not undefined
    if (updatedAtJson) {
        updatedAt = JSON.parse(updatedAtJson);

        // Validate the parsed updatedAt object with the UpdatedAt Zod schema
        const validation = UpdatedAt.safeParse(updatedAt);
        if (!validation.success) {
            // If validation fails, throw an error
            throw new Error("updatedAt is not a valid date");
        } else {
            // If validation succeeds, updatedAt contains the parsed object
            updatedAt = validation.data;
        }
    }

    // pull out search
    let search = searchParams.search;
    if (Array.isArray(search)) {
        throw new Error("search must be a string");
    }

    // build orderByObject
    // get sort_by
    let sortBy = searchParams.sortBy;
    if (sortBy) {
        let validation = z.enum(['number', 'updatedAt']).safeParse(sortBy);
        if (!validation.success) {
            throw new Error("sortBy must be either 'number' or 'updatedAt'");
        }
        sortBy = validation.data;
    }
    // get sort_order
    let sortOrder = searchParams.sortOrder;
    if (sortOrder) {
        let validation = z.enum(['asc', 'desc']).safeParse(sortOrder);
        if (!validation.success) {
            throw new Error("sortOrder must be either 'asc' or 'desc'");
        }
        sortOrder = validation.data;
    }

    // call prisma
    const orders = await prisma.customerOrder.findMany({
        where: {
            number: search,
            updatedAt: {
                gte: updatedAt?.from,
                lte: updatedAt?.to,
            },
            statusId: {
                in: statusId,
            }
        },
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
            }
        },
        orderBy: sortBy ? {
            [sortBy]: sortOrder
        } : undefined
    })

    return orders;
}