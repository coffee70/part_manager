'use server'
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";
import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable()
})  

export async function isStarted(input: z.input<typeof InputSchema>): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!modelId) return false;
    if (!instanceId) return false;

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) return false;

    return instance.route?.isStarted ?? false;
}