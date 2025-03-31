'use server'
import { z } from "zod"
import { db } from "@/lib/db"
import { InstanceDoc, stepTypes } from "@/types/collections"
import { getInstance } from "@/server/instances/get_instance"
import { RouteState } from "@/components/route_builder/list_view/types"

const InputSchema = z.object({
    modelId: z.string(),
})

const OutputSchema = z.object({
    includeDone: z.boolean().optional().default(false),
    includePaused: z.boolean().optional().default(false),
    includeNotStarted: z.boolean().optional().default(false),
    steps: z.array(z.object({
        routerId: z.string(),
        instanceId: z.string(),
        number: z.string(),
        type: z.enum(stepTypes),
    }))
})

export async function getCurrentSteps(input: z.input<typeof InputSchema>): Promise<z.infer<typeof OutputSchema>> {
    const { modelId } = InputSchema.parse(input);

    const instanceCollection = db.collection<InstanceDoc>(modelId);

    // Find instances that have a route
    const instances = await instanceCollection.find({
        route: { $exists: true },
    }).toArray();

    // check if any instances are done, paused, or not started
    const includeDone = instances.some(instance => instance.route?.state === RouteState.Completed);
    const includePaused = instances.some(instance => instance.route?.state === RouteState.Paused);
    const includeNotStarted = instances.some(instance => instance.route?.state === RouteState.Stopped);

    const steps: z.infer<typeof OutputSchema>['steps'] = [];

    for (const instance of instances) {
        if (instance.route && instance.route.routerId && instance.route.currentStepId) {
            try {
                // check if the currentStepId has already been added to the result
                if (steps.some(step => step.instanceId === instance.route?.currentStepId)) {
                    continue;
                }

                // Get the router instance using the getInstance function
                const routerInstance = await getInstance({ 
                    id: instance.route.routerId, 
                    instanceId: instance.route.currentStepId 
                });
                
                if (routerInstance) {
                    steps.push({
                        routerId: instance.route.routerId,
                        instanceId: routerInstance._id.toString(),
                        number: routerInstance.number,
                        type: "In-progress"
                    });
                }
            } catch (error) {
                console.error(`Error getting router instance: ${error}`);
            }
        }
    }

    return OutputSchema.parse({
        includeDone,
        includePaused,
        includeNotStarted,
        steps
    });
}