'use server'
import { db } from "@/lib/db";
import { getCurrentSession } from "../auth/get_current_session";
import { ModelDoc } from "@/types/collections";
import { serializeObjectIds } from "@/lib/serialization";

export async function getModels() {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const models = (await db.collection<ModelDoc>('models').find().toArray()).map(serializeObjectIds);

    return models;
}