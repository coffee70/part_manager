'use server'
import { HandlePosition, Position } from "@/components/route_builder/types"
import { db } from "@/lib/db"
import { ModelDoc, stepTypes } from "@/types/collections"
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
})

const InputSchema = z.object({
    modelId: z.string().optional()
})

export async function getRoute(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Unauthorized");

    const { modelId } = InputSchema.parse(input);
    if (!modelId) throw new Error("Model ID is required");

    const modelCollection = db.collection<ModelDoc>("models");
    const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });
    if (!model) throw new Error("Model not found");

    const route = model.route ?? { nodes: [], edges: [] };

    return OutputSchema.parse(route);
}