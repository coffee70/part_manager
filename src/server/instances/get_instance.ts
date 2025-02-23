'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc, ModelDoc, priorities, stepTypes } from "@/types/collections";
import { Node } from "@/components/route_builder/types";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
})

const OutputSchema = z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    notes: z.string(),
    step: z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(stepTypes),
    }).optional(),
    targetSteps: z.set(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(stepTypes),
    })),
    values: z.record(z.string(), z.union([z.string(), z.array(z.string())]).optional()),
})

export async function getInstance(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) throw new Error('Instance not found');

    const modelCollection = db.collection<ModelDoc>('models');
    const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });
    if (!model) throw new Error('Model not found');

    let step: Node | undefined;
    if (model.route) {
        step =
            model.route.nodes.find(node => node.id === instance.stepId)
            || model.route.nodes.find(node => node.id === model.route?.startEdge?.targetId);
    }

    let targetSteps: Set<Node> = new Set();
    if (model.route && step) {
        const targetStepIds = model.route.edges.filter(edge => edge.sourceId === step.id).map(edge => edge.targetId)
        model.route.nodes.map(node => {
            if (targetStepIds.includes(node.id)) {
                targetSteps.add(node)
            }
        })
    }
    
    return OutputSchema.parse({
        ...instance,
        step,
        targetSteps,
    });
}