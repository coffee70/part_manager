'use server'
import { db } from "@/lib/db"
import { InstanceDoc, stepTypes } from "@/types/collections"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

const OutputSchema = z.object({
    routerId: z.string(),
    currentStepId: z.string(),
    nodes: z.array(z.object({
        id: z.string(),
        instanceId: z.string(),
        name: z.string(),
        type: z.enum(stepTypes),
    })),
}).nullable();

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
})

export async function getRoute(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error("Model ID is required");

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) throw new Error("Instance not found");

    return OutputSchema.parse(instance.route ?? null);
}