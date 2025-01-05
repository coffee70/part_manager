'use server'

import { db } from "@/lib/db"
import { ModelDoc } from "@/types/collections"
import { ObjectId } from "mongodb"
import { z } from "zod"

const InputSchema = z.object({
    modelId: z.string().nullable().optional(),
})

export async function getModel(input: z.input<typeof InputSchema>) {
    const { modelId } = InputSchema.parse(input);

    if (!modelId) return null;

    const modelCollection = db.collection<ModelDoc>('models');
    const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });

    if (!model) throw new Error('Model not found');

    return {
        ...model,
        _id: model._id.toString(),
    };
}