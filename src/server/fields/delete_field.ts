'use server'
import prisma from "@/lib/database/prisma";

export async function deleteField(id: number) {
    const field = await prisma.field.delete({
        where: {
            id
        }
    })

    return field;
}