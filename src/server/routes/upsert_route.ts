'use server'
import { HandlePosition, Position } from "@/components/route_builder/types";
import { ModelDoc, stepTypes } from "@/types/collections";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    modelId: z.string().optional(),
    route: z.object({
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
    })
})

export async function upsertRoute(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");
    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { modelId, route } = validation.data;
    if (!modelId) return { success: false, error: "Model ID is required" };

    // ensure route has starting node and starting edge
    if (!route.startNode || !route.startEdge) {
        return { success: false, error: "Route must have a starting step!" }
    }

    const modelCollection = db.collection<ModelDoc>("models")
    const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });
    if (!model) return { success: false, error: "Model not found" };

    await modelCollection.updateOne(
        { _id: new ObjectId(modelId) },
        { $set: { route } }
    )

    return { success: true };
}