import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const dimensions = await prisma.dimension.findMany();
        if (!dimensions) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, dimensions);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const dimension = await prisma.dimension.create({
            data: body
        });
        return response(HttpStatus.CREATED, dimension);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}