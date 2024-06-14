import prisma from "@/lib/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const billets = await prisma.billet.findMany();
        if (!billets) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, billets);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const billet = await prisma.billet.create({
            data: body
        });
        return response(HttpStatus.CREATED, billet);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}