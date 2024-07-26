import prisma from "@/lib/database/prisma";

export async function getParts() {

    const parts = await prisma.part.findMany({
        include: {
            status: {
                select: {
                    label: true,
                    color: true
                }
            }
        }
    })

    return parts.map(part => ({
        id: part.id,
        label: part.number,
        status: part.status
    }));
}