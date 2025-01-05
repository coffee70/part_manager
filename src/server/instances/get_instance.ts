'use server'

import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc } from "@/types/collections";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
})

export async function getInstance(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });

    if (!instance) throw new Error('Instance not found');

    return {
        ...instance,
        _id: instance._id.toString(),
    };
}