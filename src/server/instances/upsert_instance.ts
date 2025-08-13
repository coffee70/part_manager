'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { contexts, InstanceDoc, priorities, ValuesSchema, KVValuesSchema, NextServerSearchParamsSchema } from "@/types/collections";
import { ObjectId, WithoutId } from "mongodb";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { router } from "@/lib/url";
import { serverToReadonlySearchParams } from "@/lib/search_params";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().optional(),
    number: z.string().min(1, { message: 'Number is required.' }),
    priority: z.enum(priorities),
    notes: z.string(),
    values: ValuesSchema,
    kv_values: KVValuesSchema,
    searchParams: NextServerSearchParamsSchema.optional(),
})

const OutputSchema = z.object({
    url: z.string(),
})

export async function upsertInstance(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema, typeof OutputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;
    const { context, id, instanceId, searchParams, ...instance } = validation.data;

    const instanceCollection = db.collection<WithoutId<InstanceDoc>>(id);

    let redirectInstanceId: string | undefined;

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
            route_fields: [],
        });

        redirectInstanceId = insertedId.toString();
    }

    if (redirectInstanceId) {
        const roParams = searchParams ? serverToReadonlySearchParams(searchParams) : undefined;
        const params = new URLSearchParams(roParams);
        params.delete('id');
        const urlWithParams = router().context(context).instances().instance(id, redirectInstanceId, params);
        return { success: true, data: { url: urlWithParams } };
    }

    return { success: true };
}