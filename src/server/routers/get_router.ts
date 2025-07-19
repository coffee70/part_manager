'use server'
import { db } from "@/lib/db"
import { RouterDoc } from "@/types/collections"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { serializeObjectIds } from "@/lib/serialization"

const InputSchema = z.object({
    routerId: z.string().nullable().optional(),
})

export async function getRouter(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { routerId } = InputSchema.parse(input);

    if (!routerId) return null;

    const routerCollection = db.collection<RouterDoc>('routers');
    const router = await routerCollection.findOne({ _id: new ObjectId(routerId) });

    if (!router) throw new Error('Model not found');

    return serializeObjectIds(router);
}