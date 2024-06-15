import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const comments = await prisma.comment.findMany();
        if (!comments) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, comments);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const comment = await prisma.comment.create({
            data: body
        });
        return response(HttpStatus.CREATED, comment);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}