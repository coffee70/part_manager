import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const statuses = await prisma.status.findMany();
        return response({
            status: HttpStatus.OK,
            body: statuses
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
        const status = await prisma.status.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: status
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}