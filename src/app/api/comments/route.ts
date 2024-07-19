import prisma from "@/lib/database/prisma";
import { response } from "@/app/api/helpers";
import { HttpStatus } from '../helpers';

export async function GET() {
    try {
        const comments = await prisma.comment.findMany();
        return response({
            status: HttpStatus.OK,
            body: comments
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
        const comment = await prisma.comment.create({
            data: body
        });
        return response({
            status: HttpStatus.CREATED,
            body: comment
        });
    } catch (e) {
        return response({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e
        });
    }
}