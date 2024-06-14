import prisma from "@/lib/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const bags = await prisma.bag.findMany();
        if (!bags) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, bags);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const bag = await prisma.bag.create({
            data: body
        });
        return response(HttpStatus.CREATED, bag);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}