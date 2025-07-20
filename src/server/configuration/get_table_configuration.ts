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
                const modelCollection = db.collection<ModelDoc>('models')
                const model = await modelCollection.findOne({ _id: new ObjectId(contextId) });

                if (!model) return defaultModelConfiguration;
                if (!model.tableConfiguration) return defaultModelConfiguration;

                // Check if the model is linkable, if it's not ensure it does not have a links column
                if (!model.linkable) {
                    model.tableConfiguration.systemColumns = 
                        model.tableConfiguration.systemColumns.filter(col => col.column != 'links')
                }

                return serializeObjectIds(model.tableConfiguration);
            case 'routers':
                const routerCollection = db.collection<RouterDoc>('routers')
                const router = await routerCollection.findOne({ _id: new ObjectId(contextId) });
                
                if (!router) return defaultRouterConfiguration;
                if (!router.tableConfiguration) return defaultRouterConfiguration;

                // Check if the router is linkable, if it's not ensure it does not have a links column
                if (!router.linkable) {
                    router.tableConfiguration.systemColumns = 
                        router.tableConfiguration.systemColumns.filter(col => col.column != 'links')
                }

                return serializeObjectIds(router.tableConfiguration);
            default:
                throw new Error('Invalid context');
        }
    } catch (error) {
        console.error('Error retrieving table configuration:', error);
        throw new Error('Failed to retrieve table configuration');
    }
} 