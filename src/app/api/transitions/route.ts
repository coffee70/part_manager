import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const transitions = await prisma.transition.findMany();
        return response({
            status: HttpStatus.OK,
            body: transitions
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
        const transition = await prisma.transition.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: transition
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}