'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, StepState } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getInstance } from "@/server/instances/get_instance";
import { Node, NodeSchema, RouteState } from "@/types/collections";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
});

const NodeSchemaWithTargetStepDetails = NodeSchema.extend({
    type: z.nativeEnum(StepState),
    routerId: z.string(),
    number: z.string(),
}).nullable();

const OutputSchema = z.object({
    previous: NodeSchemaWithTargetStepDetails,
    last: NodeSchemaWithTargetStepDetails,
    next: NodeSchemaWithTargetStepDetails
});

/**
 * Determines the next possible steps for a model instance based on its route
 * structure and current step.
 * 
 * @param input The modelId and instanceId to get target steps for
 * @returns A list of router instances that can be the next step or null if there is no route
 */
export async function getTargetSteps(
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

    if (!instance) {
        throw new Error("Model instance not found");
    }

    // Check if route exists
    if (!instance.route) {
        return {
            previous: null,
            last: null,
            next: null
        }
    }

    const { routerId, currentStepId, nodes, state } = instance.route;

    if (!routerId) {
        throw new Error("Route does not have a router ID");
    }

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return {
            previous: null,
            last: null,
            next: null
        }
    }

    const makeNodeWithDetails = async (node: Node, defaultState: StepState): Promise<z.infer<typeof NodeSchemaWithTargetStepDetails>> => {
        const routerInstance = await getInstance({ id: routerId, instanceId: node.instanceId });
        if (!routerInstance) throw new Error(`Router instance ${node.instanceId} not found`);
        return {
            id: node.id,
            instanceId: node.instanceId,
            number: routerInstance.number || '',
            routerId,
            type: node.state ?? defaultState
        }
    }

    // Completed: previous is the last node
    if (state === RouteState.Completed) {
        const index = nodes.length - 1;
        const node = nodes[index];
        return {
            previous: await makeNodeWithDetails(node, StepState.Completed),
            last: null,
            next: null,
        };
    }

    // Stopped: next is node at index 1
    if (state === RouteState.Stopped) {
        const node = nodes[1];
        return {
            previous: null,
            last: null,
            next: node ? await makeNodeWithDetails(node, StepState.NotStarted) : null,
        };
    }

    const targetSteps: z.infer<typeof OutputSchema> = {
        previous: null,
        last: null,
        next: null
    }

    // Idle: last is the current step
    if (state === RouteState.Idle) {
        if (!currentStepId) throw new Error("Route is malformed: currentStepId is missing for Idle state");
        const index = nodes.findIndex(n => n.id === currentStepId);
        if (index === -1) throw new Error("Route is malformed: current step not found in nodes");
        const node = nodes[index];
        targetSteps.last = await makeNodeWithDetails(node, StepState.Completed);
    }

    // Other states (e.g., Started, Paused): compute previous and next around current step
    if (!currentStepId) throw new Error("Route is malformed: currentStepId is missing");
    const currentIndex = nodes.findIndex(n => n.id === currentStepId);
    if (currentIndex === -1) throw new Error("Route is malformed: current step not found in nodes");

    const previousNode = currentIndex > 0 ? nodes[currentIndex - 1] : undefined;
    const nextNode = currentIndex < nodes.length - 1 ? nodes[currentIndex + 1] : undefined;

    targetSteps.previous = previousNode ? await makeNodeWithDetails(previousNode, StepState.Completed) : null;
    targetSteps.next = nextNode ? await makeNodeWithDetails(nextNode, StepState.NotStarted) : null;

    return targetSteps;
} 