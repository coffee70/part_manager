'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { 
    ModelTableConfigurationSchema, 
    RouterTableConfigurationSchema,
    ModelDoc,
    RouterDoc,
    ModelTableConfiguration,
    RouterTableConfiguration,
    contexts
} from "@/types/collections";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    context: z.enum(contexts, 
        { message: 'Context is required.' }
    ).refine(
        ctx => ctx !== 'users', 
        { message: 'The users context is not configurable.' }
    ),
    contextId: z.string().min(1, { message: 'Context ID is required.' }),
    tableConfiguration: ModelTableConfigurationSchema.or(RouterTableConfigurationSchema),
}).refine(input => {
    if (input.context === 'routers') {
        // ensure that the system columns do not have a step column
        return !input.tableConfiguration.systemColumns.some(col => col.column === 'step');
    }
    return true;
}, {
    message: 'The step column is not allowed for routers.',
    path: ['tableConfiguration']
});

// Type predicates to help TypeScript narrow the union type
function isModelTableConfiguration(
    context: string, 
    config: ModelTableConfiguration | RouterTableConfiguration
): config is ModelTableConfiguration {
    return context === 'models';
}

function isRouterTableConfiguration(
    context: string, 
    config: ModelTableConfiguration | RouterTableConfiguration
): config is RouterTableConfiguration {
    return context === 'routers';
}

// Transform functions to convert client data to database format
// Generate fresh ObjectIds for each column - frontend IDs are only for React rendering
function transformModelTableConfiguration(config: ModelTableConfiguration) {
    return {
        systemColumns: config.systemColumns.map(col => ({
            ...col,
            _id: new ObjectId() // Generate fresh ObjectId
        })),
        intrinsicFieldColumns: config.intrinsicFieldColumns.map(col => ({
            ...col,
            _id: new ObjectId() // Generate fresh ObjectId
        }))
    };
}

function transformRouterTableConfiguration(config: RouterTableConfiguration) {
    return {
        systemColumns: config.systemColumns.map(col => ({
            ...col,
            _id: new ObjectId() // Generate fresh ObjectId
        })),
        intrinsicFieldColumns: config.intrinsicFieldColumns.map(col => ({
            ...col,
            _id: new ObjectId() // Generate fresh ObjectId
        }))
    };
}

export async function upsertTableConfiguration(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { context, contextId, tableConfiguration } = validation.data;

    try {
        switch (context) {
            case 'models':
                if (isModelTableConfiguration(context, tableConfiguration)) {
                    const modelCollection = db.collection<ModelDoc>('models');
                    const model = await modelCollection.findOne({ _id: new ObjectId(contextId) });

                    if (!model) return { success: false, error: "Model not found" };
                    if (!model.linkable) {
                        if (tableConfiguration.systemColumns.some(col => col.column == 'links')) {
                            return { 
                                success: false, 
                                error: "This model is not linkable. Please remove the links column and try again.",
                            }
                        }
                    }

                    const transformedModelConfig = transformModelTableConfiguration(tableConfiguration);
                    await modelCollection.updateOne(
                        { _id: new ObjectId(contextId) },
                        { $set: { tableConfiguration: transformedModelConfig } }
                    );
                    return { success: true };
                }
                return { success: false, error: "Invalid table configuration for models" };
            case 'routers':
                if (isRouterTableConfiguration(context, tableConfiguration)) {
                    const routerCollection = db.collection<RouterDoc>('routers');
                    const router = await routerCollection.findOne({ _id: new ObjectId(contextId) });

                    if (!router) return { success: false, error: "Router not found" };
                    if (!router.linkable) {
                        if (tableConfiguration.systemColumns.some(col => col.column == 'links')) {
                            return { 
                                success: false, 
                                error: "This router is not linkable. Please remove the links column and try again.",
                            }
                        }
                    }

                    const transformedRouterConfig = transformRouterTableConfiguration(tableConfiguration);
                    await routerCollection.updateOne(
                        { _id: new ObjectId(contextId) },
                        { $set: { tableConfiguration: transformedRouterConfig } }
                    );
                    return { success: true };
                }
                return { success: false, error: "Invalid table configuration for routers" };
            default:
                return { success: false, error: "Invalid context" };
        }
    } catch (error) {
        console.error('Error updating table configuration:', error);
        return { success: false, error: "Failed to update table configuration" };
    }
} 