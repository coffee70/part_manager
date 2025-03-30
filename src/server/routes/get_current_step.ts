'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, stepTypes, StepType } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getInstance } from "../instances/get_instance";
import { RouteState } from "@/components/route_builder/list_view/types";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
});

const OutputSchema = z.object({
    _id: z.string(),
    name: z.string(),
    type: z.enum(stepTypes),
});

/**
 * Gets the current step of a model instance by retrieving its routerId and stepId,
 * then fetching the corresponding router instance.
 * 
 * A step in a model route is a router instance.
 */
export async function getCurrentStep(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!modelId) throw new Error("Model ID is required");
    if (!instanceId) throw new Error("Instance ID is required");

    // Get the model instance to access its route information
    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({
        _id: new ObjectId(instanceId)
    });

    if (!instance) {
        throw new Error("Model instance not found");
    }

    // Check if route exists
    if (!instance.route) {
        return null;
    }

    // Access routerId and currentStepId from the route object
    const { routerId, currentStepId, state } = instance.route;

    if (!routerId) {
        throw new Error("Route does not have a router ID");
    }

    if (!currentStepId && state === RouteState.Completed) {
        return OutputSchema.parse({
            _id: "done",
            name: "Done",
            type: "Done" as StepType,
        });
    }

    if (!currentStepId) {
        throw new Error("Route does not have a current step");
    }

    // Get the router instance that represents the current step
    try {
        // Use getInstance to get the router instance
        const routerInstance = await getInstance({
            id: routerId,
            instanceId: currentStepId
        });

        return OutputSchema.parse({
            _id: routerInstance._id.toString(),
            name: routerInstance.number,
            // TODO: Remove this once we have a proper type for the step type
            type: 'To-do' as StepType,
        });
    } catch (error) {
        console.error("Error fetching current step:", error);
        throw new Error("Failed to fetch current step");
    }
} 