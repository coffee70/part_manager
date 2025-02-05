'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { ModelDoc } from "@/types/collections";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    modelId: z.string(),
})


export async function isAttachable(
    input: z.input<typeof InputSchema>
): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return false;

    const { modelId } = validation.data;

    const modelCollection = db.collection<ModelDoc>('models');
    const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });

    if (!model) throw new Error('Model not found.');

    return model.attachable;
}