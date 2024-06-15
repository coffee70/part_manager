import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers';
import { validateJson } from "@/api/validation";
import { FieldModel } from "@prisma/client";

export async function GET() {
    try {
        const orders = await prisma.order.findMany();
        if (!orders) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, orders);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const valid = await validateJson(body.fields, FieldModel.ORDER);
        if (valid !== true) return response(HttpStatus.BAD_REQUEST, { error: valid });
        const order = await prisma.order.create({
            data: body
        });
        return response(HttpStatus.CREATED, order);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}