import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const parts = await prisma.part.findMany();
        if (!parts) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, parts);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const part = await prisma.part.create({
            data: body
        });
        return response(HttpStatus.CREATED, part);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}