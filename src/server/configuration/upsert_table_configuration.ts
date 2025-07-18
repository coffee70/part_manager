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
})

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
        const collection = db.collection<ModelDoc | RouterDoc>(context);
        
        const isRouter = context === 'routers';
        
        const transformedConfig = isRouter 
            ? transformRouterTableConfiguration(tableConfiguration as RouterTableConfiguration)
            : transformModelTableConfiguration(tableConfiguration as ModelTableConfiguration);
            
        await collection.updateOne(
            { _id: new ObjectId(contextId) },
            { $set: { tableConfiguration: transformedConfig } }
        );

        return { success: true };
    } catch (error) {
        console.error('Error updating table configuration:', error);
        throw new Error('Failed to update table configuration');
    }
} 