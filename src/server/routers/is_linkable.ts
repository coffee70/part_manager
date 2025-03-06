'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { RouterDoc } from "@/types/collections";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    routerId: z.string(),
})

export async function isLinkable(
    input: z.input<typeof InputSchema>
): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return false;

    const { routerId } = validation.data;

    const routerCollection = db.collection<RouterDoc>('routers');
    const router = await routerCollection.findOne({ _id: new ObjectId(routerId) });

    if (!router) throw new Error('Router not found.');

    return router.linkable;
}