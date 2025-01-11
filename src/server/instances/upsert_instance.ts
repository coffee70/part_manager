'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, priorities } from "@/types/collections";
import { ObjectId, WithoutId } from "mongodb";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().optional(),
    instance: z.object({
        number: z.string(),
        priority: z.enum(priorities),
        notes: z.string(),
        values: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.undefined()])),
    }),
})

export async function upsertInstance(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, instance } = InputSchema.parse(input);

    const instanceCollection = db.collection<WithoutId<InstanceDoc>>(modelId);

    if (instanceId) {
        await instanceCollection.updateOne({ _id: new ObjectId(instanceId) }, { $set: instance });
    } else {
        await instanceCollection.insertOne({
            ...instance,
            links: [],
            comments: [],
            attachments: [],
            updatedAt: new Date(),
            updatedById: user._id,
        });
    }
}