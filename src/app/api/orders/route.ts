import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers';
import { validateJson } from "@/app/api/validation";
import { FieldModel } from "@prisma/client";

export async function GET() {
    try {
        const orders = await prisma.order.findMany();
        return response({
            status: HttpStatus.OK,
            body: orders
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const valid = await validateJson(body.fields, FieldModel.ORDER);
        if (valid !== true) return response({
            status: HttpStatus.BAD_REQUEST,
            error: valid
        });
        const order = await prisma.order.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: order
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}