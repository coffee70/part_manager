import prisma from "@/lib/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const transitions = await prisma.transition.findMany();
        if (!transitions) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, transitions);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const transition = await prisma.transition.create({
            data: body
        });
        return response(HttpStatus.CREATED, transition);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}