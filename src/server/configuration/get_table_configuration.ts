'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { 
    ModelDoc,
    RouterDoc,
    defaultModelConfiguration,
    defaultRouterConfiguration,
    contexts
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

export async function getTableConfiguration(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = InputSchema.parse(input);
    const { context, contextId } = validation;

    try {
        const collection = db.collection<ModelDoc | RouterDoc>(context);
        const document = await collection.findOne({ _id: new ObjectId(contextId) });
        
        if (!document) throw new Error('Document not found');
        
        if (!document.tableConfiguration) {
            return context === 'routers'
                ? defaultRouterConfiguration 
                : defaultModelConfiguration;
        }
        
        return serializeObjectIds(document.tableConfiguration);
    } catch (error) {
        console.error('Error retrieving table configuration:', error);
        throw new Error('Failed to retrieve table configuration');
    }
} 