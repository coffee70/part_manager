'use server'
import { db } from "@/lib/db";
import { getCurrentSession } from "../auth/get_current_session";
import { RouterDoc } from "@/types/collections";

export async function getRouters() {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const routers = (await db.collection<RouterDoc>('routers').find().toArray()).map(router => ({
        ...router,
        _id: router._id.toString(),
    }));

    return routers;
}