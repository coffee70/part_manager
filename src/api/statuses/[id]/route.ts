import { response } from "@/api/helpers";
import prisma from "@/lib/prisma";
import { HttpStatus } from '../../helpers'; // Add this line

type Params = {
    params: {
        id: string;
    }
}

export async function GET(_: Request, { params }: Params) {
    const { id } = params;
    try {
        const status = await prisma.status.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!status) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, status);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const body = await request.json();
    try {
        const status = await prisma.status.update({
            where: {
                id: parseInt(id)
            },
            data: body
        });
        return response(HttpStatus.OK, status);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const { id } = params;
    try {
        await prisma.status.delete({
            where: {
                id: parseInt(id)
            }
        });
        return response(HttpStatus.NO_CONTENT);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}