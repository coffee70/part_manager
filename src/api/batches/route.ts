import prisma from "@/lib/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const batches = await prisma.batch.findMany();
        if (!batches) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, batches);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const batch = await prisma.batch.create({
            data: body
        });
        return response(HttpStatus.CREATED, batch);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}