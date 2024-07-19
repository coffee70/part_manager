import { response } from "@/app/api/helpers";
import prisma from "@/lib/database/prisma";
import { HttpStatus } from '../../helpers';

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
        if (!status) return response({
            status: HttpStatus.NOT_FOUND
        });
        return response({
            status: HttpStatus.OK,
            body: status
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
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
        return response({
            status: HttpStatus.OK,
            body: status
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
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
        return response({
            status: HttpStatus.NO_CONTENT
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}