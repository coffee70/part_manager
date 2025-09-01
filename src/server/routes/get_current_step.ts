'use server'
import { z } from "zod";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, NodeSchema, StepState } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getInstance } from "@/server/instances/get_instance";
import { RouteState } from "@/types/collections";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
});

const NodeSchemaWithRouterInstanceName = NodeSchema.extend({
    name: z.string(),
    type: z.nativeEnum(StepState),
});

const OutputSchema = NodeSchemaWithRouterInstanceName.nullable();

/**
 * Gets the current step of a model instance by retrieving its routerId and stepId,
 * then fetching the corresponding router instance.
 * 
 * A step in a model route is a router instance.
 */
export async function getCurrentStep(
    input: z.input<typeof InputSchema>
): Promise<z.infer<typeof OutputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error("Instance ID is required");

    // Get the model instance to access its route information
    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({
        _id: new ObjectId(instanceId)
    });

    // This is an actual error, do not return null
    if (!instance) {
        throw new Error(`Model instance not found: ${modelId} ${instanceId}`);
    }

    // This is not an actual error, and is a possible state of the instance
    // thus we return null
    if (!instance.route) {
        return null;
    }

    // Access routerId and currentStepId from the route object
    const { routerId, currentStepId, state } = instance.route;

    // This is an actual error, do not return null
    // All routes have a router ID
    if (!routerId) {
        throw new Error("Route does not have a router ID");
    }

    // This state will occur when the route is completed
    if (!currentStepId && state === RouteState.Completed) {
        return null;
    }

    // This state will occur when the route is stopped/not started
    if (!currentStepId && state === RouteState.Stopped) {
        return null;
    }

    // All other states will have a current step ID
    if (!currentStepId) {
        throw new Error("Current step ID not found");
    }

    const node = instance.route.nodes.find(node => node.id === currentStepId);
    // This is an actual error, do not return null
    // If the current step is not found in the route nodes, then the route is corrupted
    if (!node) {
        throw new Error("Current step not found in route nodes");
    }

    // Get the router instance that represents the current step
    try {
        // Use getInstance to get the router instance
        const routerInstance = await getInstance({
            id: routerId,
            instanceId: node.instanceId
        });

        if (!routerInstance) {
            throw new Error("Router instance not found");
        }
        
        switch (state) {
            case RouteState.Paused:
            case RouteState.Idle:
                return {
                    ...node,
                    name: routerInstance.number,
                    type: node.state ?? StepState.Completed
                };
            case RouteState.Started:
                return {
                    ...node,
                    name: routerInstance.number,
                    type: node.state ?? StepState.InProgress
                };
            default:
                throw new Error("Invalid route state");
        }
    } catch (error) {
        console.error("Error fetching current step:", error);
        throw new Error("Failed to fetch current step");
    }
} 