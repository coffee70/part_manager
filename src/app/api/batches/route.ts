import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers';

export async function GET() {
    try {
        const batches = await prisma.batch.findMany();
        return response({
            status: HttpStatus.OK,
            body: batches
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
        const batch = await prisma.batch.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: batch
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}