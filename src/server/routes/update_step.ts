'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
    stepId: z.string(),
});

export async function updateStep(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, instanceId, stepId } = validation.data;
    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(modelId);

    await instanceCollection.updateOne(
        { _id: new ObjectId(instanceId) },
        { $set: { stepId } }
    );

    return { success: true };
}