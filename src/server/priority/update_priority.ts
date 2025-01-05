'use server'
import { InstanceDoc, priorities } from "@/types/collections";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
    priority: z.enum(priorities)
})

export async function updatePriority(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, priority } = InputSchema.parse(input);

    if (!instanceId) throw new Error('instanceId is required');

    const instanceCollection = db.collection<InstanceDoc>(modelId);

    await instanceCollection.updateOne({
        _id: new ObjectId(instanceId)
    }, {
        $set: {
            priority,
            updatedAt: new Date(),
            updatedById: user._id
        }
    });
}