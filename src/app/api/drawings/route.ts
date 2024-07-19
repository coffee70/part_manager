import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers';

export async function GET() {
    try {
        const drawings = await prisma.drawing.findMany();
        return response({
            status: HttpStatus.OK,
            body: drawings
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
        const drawing = await prisma.drawing.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: drawing
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}