import { response } from "@/api/helpers";
import prisma from "@/lib/database/prisma";
import { HttpStatus } from '../../helpers';
import { validateJson } from "@/api/validation";
import { FieldModel } from "@prisma/client";

type Params = {
    params: {
        id: string;
    }
}

export async function GET(_: Request, { params }: Params) {
    const { id } = params;
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!order) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, order);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = params;
    const body = await request.json();
    try {
        const order = await prisma.order.update({
            where: {
                id: parseInt(id)
            },
            data: body
        });
        return response(HttpStatus.OK, order);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const { id } = params;
    try {
        await prisma.order.delete({
            where: {
                id: parseInt(id)
            }
        });
        return response(HttpStatus.NO_CONTENT);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}