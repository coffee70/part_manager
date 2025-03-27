'use server'
import { z } from "zod";
import { InstanceDoc } from "@/types/collections";
import { db } from "@/lib/db";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable()
})

export async function startRoute(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, instanceId } = validation.data;
    if (!instanceId) {
        return {
            success: false,
            error: "Instance ID is required"
        }
    }

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) {
        return {
            success: false,
            error: "Instance not found"
        }
    }

    await instanceCollection.updateOne(
        { _id: new ObjectId(instanceId) },
        { $set: { "route.isStarted": true } }
    )

    return { success: true };
}