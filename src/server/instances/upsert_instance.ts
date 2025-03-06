'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { contexts, InstanceDoc, ModelDoc, priorities } from "@/types/collections";
import { ObjectId, WithoutId } from "mongodb";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { router } from "@/lib/url";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().optional(),
    number: z.string().min(1, { message: 'Number is required.' }),
    priority: z.enum(priorities),
    notes: z.string(),
    values: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.undefined()])),
})

const OutputSchema = z.object({
    redirect: z.string().optional(),
})

export async function upsertInstance(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema, typeof OutputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;
    const { context, id, instanceId, ...instance } = validation.data;

    const instanceCollection = db.collection<WithoutId<InstanceDoc>>(id);

    let redirectInstanceId;

    if (instanceId) {
        await instanceCollection.updateOne({ _id: new ObjectId(instanceId) }, { $set: instance });
    } else {
        const { insertedId } = await instanceCollection.insertOne({
            ...instance,
            links: [],
            comments: [],
            attachments: [],
            updatedAt: new Date(),
            updatedById: user._id,
        });

        redirectInstanceId = insertedId.toString();
    }

    return {
        success: true,
        data: {
            redirect:
                redirectInstanceId
                    ? router().context(context).instances().instance(id, redirectInstanceId)
                    : undefined
        }
    };
}