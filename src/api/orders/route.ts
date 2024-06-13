import prisma from "@/lib/prisma";
import { response } from "@/api/helpers";

export async function GET() {
    try {
        const orders = await prisma.order.findMany();
        if (!orders) return response(404);
        return response(200, orders);
    } catch {
        return response(500);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const order = await prisma.order.create({
            data: body
        });
        return response(201, order);
    } catch {
        return response(500);
    }
}