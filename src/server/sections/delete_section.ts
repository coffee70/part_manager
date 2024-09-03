'use server'
import prisma from "@/lib/database/prisma";

export async function deleteSection(id: number) {
    const section = await prisma.section.delete({
        where: {
            id: id
        }
    })

    return section;
}