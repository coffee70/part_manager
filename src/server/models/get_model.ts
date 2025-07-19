'use server'
import { db } from "@/lib/db"
import { ModelDoc } from "@/types/collections"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { serializeObjectIds } from "@/lib/serialization"

const InputSchema = z.object({
    modelId: z.string().nullable().optional(),
})

export async function getModel(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId } = InputSchema.parse(input);

    if (!modelId) return null;

    const modelCollection = db.collection<ModelDoc>('models');
    const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });

    if (!model) throw new Error('Model not found');

    return serializeObjectIds(model);
}