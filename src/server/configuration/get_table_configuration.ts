'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import {
    ModelDoc,
    RouterDoc,
    defaultModelConfiguration,
    defaultRouterConfiguration,
    contexts,
    ModelTableConfiguration,
    RouterTableConfiguration
} from "@/types/collections";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { serializeObjectIds } from "@/lib/serialization";

const InputSchema = z.object({
    context: z.enum(contexts,
        { message: 'Context is required.' }
    ).refine(
        ctx => ctx !== 'users',
        { message: 'The users context is not configurable.' }
    ),
    contextId: z.string().min(1, { message: 'Context ID is required.' }),
})

export async function getTableConfiguration(input: z.input<typeof InputSchema>):
    Promise<ModelTableConfiguration | RouterTableConfiguration> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = InputSchema.parse(input);
    const { context, contextId } = validation;

    try {
        switch (context) {
            case 'models':
                const model = await db.collection<ModelDoc>('models').findOne({ _id: new ObjectId(contextId) });
                if (!model) throw new Error('Model not found');
                if (!model.tableConfiguration) { return defaultModelConfiguration; }
                return serializeObjectIds(model.tableConfiguration);
            case 'routers':
                const router = await db.collection<RouterDoc>('routers').findOne({ _id: new ObjectId(contextId) });
                if (!router) throw new Error('Router not found');
                if (!router.tableConfiguration) { return defaultRouterConfiguration; }
                return serializeObjectIds(router.tableConfiguration);
            default:
                throw new Error('Invalid context');
        }
    } catch (error) {
        console.error('Error retrieving table configuration:', error);
        throw new Error('Failed to retrieve table configuration');
    }
} 