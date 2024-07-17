import { response } from "@/app/api/helpers";
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
        const drawing = await prisma.drawing.findUnique({
            where: {
                id: id
            }
        });
        if (!drawing) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, drawing);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const body = await request.json();
    try {
        const drawing = await prisma.drawing.update({
            where: {
                id: id
            },
            data: body
        });
        return response(HttpStatus.OK, drawing);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const { id } = params;
    try {
        await prisma.drawing.delete({
            where: {
                id: id
            }
        });
        return response(HttpStatus.NO_CONTENT);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}