import prisma from "@/lib/database/prisma";

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
            attachments: true
        }
    })

    if (order === null) return order

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
        attachments: await Promise.all(order.attachments.map(async (attachment) => {
 
                const url = process.env.FILE_GET_URL + attachment.id
                return url
        }))
    };
}