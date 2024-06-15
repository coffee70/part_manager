import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const statuses = await prisma.status.findMany();
        if (!statuses) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, statuses);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const status = await prisma.status.create({
            data: body
        });
        return response(HttpStatus.CREATED, status);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}