'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, priorities } from "@/types/collections";
import { ObjectId, WithoutId } from "mongodb";
import { ActionState, validate } from "@/lib/validators/server_actions";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().optional(),
    number: z.string().min(1, { message: 'Number is required.' }),
    priority: z.enum(priorities),
    notes: z.string(),
    values: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.undefined()])),
})

export async function upsertInstance(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;
    const { modelId, instanceId, ...instance } = validation.data;

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

    return { success: true };
}