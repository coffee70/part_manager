import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers';

export async function GET() {
    try {
        const serials = await prisma.serial.findMany();
        return response({
            status: HttpStatus.OK,
            body: serials
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
        const serial = await prisma.serial.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: serial
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}