'use server'
import { HandlePosition } from "@/components/route_builder/types"
import { db } from "@/lib/db"
import { InstanceDoc, stepTypes } from "@/types/collections"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

const OutputSchema = z.object({
    nodes: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum([...stepTypes]),
        x: z.number(),
        y: z.number(),
    })),
    edges: z.array(z.object({
        id: z.string(),
        sourceId: z.string(),
        sourcePosition: z.nativeEnum(HandlePosition),
        targetId: z.string(),
        targetPosition: z.nativeEnum(HandlePosition),
        path: z.string(),
    })),
    startEdge: z.object({
        id: z.string(),
        sourceId: z.string(),
        sourcePosition: z.nativeEnum(HandlePosition),
        targetId: z.string(),
        targetPosition: z.nativeEnum(HandlePosition),
        path: z.string(),
    }).optional(),
    startNode: z.object({
        id: z.literal("start"),
        x: z.number(),
        y: z.number(),
    }).optional(),
}).nullable()

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
    
    return OutputSchema.parse(instance.route ?? null);
}