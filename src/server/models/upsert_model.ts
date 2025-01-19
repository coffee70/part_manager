'use server'
import { ActionState, validate } from "@/lib/validators/server_actions"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { ModelDoc } from "@/types/collections";
import { ObjectId, WithoutId } from "mongodb";

const InputSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: 'Name is required.' }),
    attachable: z.boolean(),
    linkable: z.boolean(),
    commentable: z.boolean(),
    color: z.string(),
})

export async function upsertModel(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { _id, ...model } = input;
    const models = db.collection<WithoutId<ModelDoc>>('models');

    if (_id) {
        await models.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...model,
                    updatedAt: new Date(),
                    updatedBy: user._id
                }
            }
        );
    } else {
        await models.insertOne({
            ...model,
            updatedAt: new Date(),
            updatedBy: user._id
        });
    }

    return { success: true };
}