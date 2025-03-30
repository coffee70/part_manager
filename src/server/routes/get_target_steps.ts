'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { InstanceDoc, StepType } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getInstance } from "../instances/get_instance";
import { Node, RouteState } from "@/components/route_builder/list_view/types";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
});

type TargetStep = {
    id: string;
    instanceId: string;
    number: string;
    routerId: string;
    type: StepType;
};

/**
 * Determines the next possible steps for a model instance based on its route
 * structure and current step.
 * 
 * @param input The modelId and instanceId to get target steps for
 * @returns A list of router instances that can be the next step or null if there is no route
 */
export async function getTargetSteps(
    input: z.input<typeof InputSchema>
): Promise<TargetStep[] | null> {
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

    const { routerId, currentStepId, nodes, state } = instance.route;

    if (!routerId) {
        throw new Error("Route does not have a router ID");
    }

    if (!currentStepId 
        && state !== RouteState.Completed
        && state !== RouteState.Stopped) {
        throw new Error("Route does not have a current step");
    }

    if (!nodes || !Array.isArray(nodes)) {
        return []; // No edges means no target steps
    }

    // Find the current node
    let currentNodeIndex = nodes.findIndex(node => node.instanceId === currentStepId);

    // If no current node and route is completed, set currentNodeIndex to out of bounds
    if (currentNodeIndex === -1 && state === RouteState.Completed) {
        currentNodeIndex = nodes.length;
    }
    // if no current node and route is stopped, set currentNodeIndex to out of bounds
    else if (currentNodeIndex === -1 && state === RouteState.Stopped) {
        currentNodeIndex = -1;
    }
    // If no current node, return empty array
    else if (currentNodeIndex === -1) {
        return [];
    }

    // Get unique target IDs
    let nextNode: Node | undefined = nodes[currentNodeIndex + 1];
    let previousNode: Node | undefined = nodes[currentNodeIndex - 1];

    // Fetch all target router instances
    const targetSteps: TargetStep[] = [];

    if (nextNode) {
        try {
            // Get the router instance
            const routerInstance = await getInstance({
                id: routerId,
                instanceId: nextNode.instanceId
            });

            if (routerInstance) {
                targetSteps.push({
                    id: nextNode.id,
                    instanceId: routerInstance._id,
                    number: routerInstance.number || '',
                    routerId,
                    type: 'In-progress'
                });
            }
        } catch (error) {
            console.error(`Error fetching target step ${nextNode.instanceId}:`, error);
            // Continue with other steps even if one fails
        }
    }

    if (previousNode) {
        try {
            // Get the router instance
            const routerInstance = await getInstance({
                id: routerId,
                instanceId: previousNode.instanceId
            });

            if (routerInstance) {
                targetSteps.push({
                    id: previousNode.id,
                    instanceId: routerInstance._id,
                    number: routerInstance.number || '',
                    routerId,
                    type: 'In-progress'
                });
            }
        } catch (error) {
            console.error(`Error fetching previous step ${previousNode.instanceId}:`, error);
            // Continue with other steps even if one fails
        }
    }


    return targetSteps;
} 