"use server"
import { z } from "zod";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, RouteState, StepState } from "@/types/collections";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
})

export async function stopRoute(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error("Instance ID is required");

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) throw new Error("Instance not found");

    if (!instance.route) throw new Error("Instance does not have a route");

    instance.route.state = RouteState.Stopped;

    instance.route.currentStepId = null;

    instance.route.nodes.forEach(node => {
        node.state = StepState.NotStarted;
    });

    await instanceCollection.updateOne(
        {
            _id: new ObjectId(instanceId)
        },
        {
            $set: {
                route: instance.route,
                updatedAt: new Date(),
                updatedById: user._id
            }
        }
    );

    return { success: true };
}