import prisma from "@/lib/database/prisma";
import { response } from "@/api/helpers";
import { HttpStatus } from '../helpers'; // Add this line

export async function GET() {
    try {
        const customers = await prisma.customer.findMany();
        if (!customers) return response(HttpStatus.NOT_FOUND);
        return response(HttpStatus.OK, customers);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const customer = await prisma.customer.create({
            data: body
        });
        return response(HttpStatus.CREATED, customer);
    } catch {
        return response(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}