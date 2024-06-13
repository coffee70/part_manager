import { response } from "@/api/helpers";
import prisma from "@/lib/prisma";

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
        if (!order) return response(404);
        return response(200, order);
    } catch {
        return response(500);
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
        return response(200, order);
    } catch {
        return response(500);
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
        return response(204);
    } catch {
        return response(500);
    }
}