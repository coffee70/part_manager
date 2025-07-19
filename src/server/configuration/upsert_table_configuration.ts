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
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { context, contextId, tableConfiguration } = validation.data;

    try {
        switch (context) {
            case 'models':
                if (isModelTableConfiguration(context, tableConfiguration)) {
                    const modelCollection = db.collection<ModelDoc>('models');
                    const transformedModelConfig = transformModelTableConfiguration(tableConfiguration);
                    await modelCollection.updateOne(
                        { _id: new ObjectId(contextId) },
                        { $set: { tableConfiguration: transformedModelConfig } }
                    );
                    return { success: true };
                }
                throw new Error('Invalid table configuration for models');
            case 'routers':
                if (isRouterTableConfiguration(context, tableConfiguration)) {
                    const routerCollection = db.collection<RouterDoc>('routers');
                    const transformedRouterConfig = transformRouterTableConfiguration(tableConfiguration);
                    await routerCollection.updateOne(
                        { _id: new ObjectId(contextId) },
                        { $set: { tableConfiguration: transformedRouterConfig } }
                    );
                    return { success: true };
                }
                throw new Error('Invalid table configuration for routers');
            default:
                throw new Error('Invalid context');
        }
    } catch (error) {
        console.error('Error updating table configuration:', error);
        throw new Error('Failed to update table configuration');
    }
} 