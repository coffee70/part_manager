'use server'
import { z } from "zod";
import { InstanceDoc } from "@/types/collections";
import { db } from "@/lib/db";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { ObjectId } from "mongodb";
import { RouteState } from "@/types/collections";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
    state: z.nativeEnum(RouteState)
})

export async function updateRouteState(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, instanceId, state } = validation.data;
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

    if (!instance.route) {
        return {
            success: false,
            error: "No route found for this instance"
        }
    }

    const updateFields: Record<string, any> = { 
        "route.state": state,
        updatedAt: new Date(),
        updatedById: user._id
    };

    // If the route is being stopped, reset the currentStepId to null
    if (state === RouteState.Stopped) {
        updateFields["route.currentStepId"] = null;
    }

    if (state === RouteState.Completed) {
        updateFields["route.currentStepId"] = null;
    }

    await instanceCollection.updateOne(
        { _id: new ObjectId(instanceId) },
        { $set: updateFields }
    );

    return { success: true };
} 