import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers';

export async function GET() {
    try {
        const dimensions = await prisma.dimension.findMany();
        return response({
            status: HttpStatus.OK,
            body: dimensions
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
        const dimension = await prisma.dimension.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: dimension
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}