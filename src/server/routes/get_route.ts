'use server'
import { db } from "@/lib/db"
import { InstanceDoc, NodeSchema, StepState } from "@/types/collections"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { RouteSchema } from "@/types/collections"

const NodeSchemaWithRouterInstanceNumber = NodeSchema.extend({
    name: z.string(),
})

const RouteSchemaWithRouterInstanceNumber = RouteSchema.extend({
    nodes: z.array(NodeSchemaWithRouterInstanceNumber),
})

const OutputSchema = RouteSchemaWithRouterInstanceNumber.nullable();

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

    if (instance.route) {
        const routerInstanceCollection = db.collection<InstanceDoc>(instance.route.routerId)
        return OutputSchema.parse({
            ...instance.route,
            nodes: await Promise.all(instance.route.nodes.map(async node => {
                const routerInstance = await routerInstanceCollection.findOne({
                    _id: new ObjectId(node.instanceId)
                })
                if (!routerInstance) return;
                return {
                    ...node,
                    name: routerInstance.number,
                    type: node.state ?? StepState.Completed
                }
            }))
        })
    }

    return null;
}