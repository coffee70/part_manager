"use server";
import { db } from "@/lib/db";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getCurrentStep } from "./get_current_step";
import { RouteState, StepState } from "@/types/collections";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string(),
});

export async function failStep(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, instanceId } = validation.data;
    if (!modelId) throw new Error("Model ID is required");
    if (!instanceId) throw new Error("Instance ID is required");

    const currentStep = await getCurrentStep({ modelId, instanceId });
    if (!currentStep) throw new Error("Current step not found");

    const instanceCollection = db.collection<InstanceDoc>(modelId);

    // Fetch the instance to get the nodes array
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance || !instance.route || !Array.isArray(instance.route.nodes)) {
        throw new Error("Instance or route nodes not found");
    }

    // Update the state of the matching node in the array
    const updatedNodes = instance.route.nodes.map(node =>
        node.id === currentStep.id ? { ...node, state: StepState.Failed } : node
    );

    // Update the whole nodes array
    await instanceCollection.updateOne(
        { _id: new ObjectId(instanceId) },
        {
            $set: {
                route: {
                    ...instance.route,
                    nodes: updatedNodes,
                    state: RouteState.Idle,
                }
            }
        }
    );

    return { success: true };
}