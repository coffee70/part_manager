'use server'
import { db } from "@/lib/db";
import { getCurrentSession } from "../auth/get_current_session";
import { ModelDoc } from "@/types/collections";

export async function getModels() {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const models = (await db.collection<ModelDoc>('models').find().toArray()).map(model => ({
        ...model,
        _id: model._id.toString(),
    }));

    return models;
}