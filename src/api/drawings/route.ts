import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const drawings = await prisma.drawing.findMany();
        if (!drawings) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, drawings);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const drawing = await prisma.drawing.create({
            data: body
        });
        return response(HttpStatus.CREATED, drawing);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}