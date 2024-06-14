import prisma from "@/lib/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const serials = await prisma.serial.findMany();
        if (!serials) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, serials);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const serial = await prisma.serial.create({
            data: body
        });
        return response(HttpStatus.CREATED, serial);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}