import { response } from "@/api/helpers";
import prisma from "@/lib/database/prisma";
import { HttpStatus } from '../../helpers'; // Add this line

type Params = {
    params: {
        id: string;
    }
}

export async function GET(_: Request, { params }: Params) {
    const { id } = params;
    try {
        const part = await prisma.part.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!part) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, part);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const body = await request.json();
    try {
        const part = await prisma.part.update({
            where: {
                id: parseInt(id)
            },
            data: body
        });
        return response(HttpStatus.OK, part);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const { id } = params;
    try {
        await prisma.part.delete({
            where: {
                id: parseInt(id)
            }
        });
        return response(HttpStatus.NO_CONTENT);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}