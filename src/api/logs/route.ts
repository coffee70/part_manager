import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const logs = await prisma.log.findMany();
        if (!logs) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, logs);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const log = await prisma.log.create({
            data: body
        });
        return response(HttpStatus.CREATED, log);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}