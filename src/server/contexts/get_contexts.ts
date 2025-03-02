'use server'
import { contexts } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { getModels } from "../models/get_models";
import { getRouters } from "../routers/get_routers";

const InputSchema = z.object({
    context: z.enum(contexts),
})

export async function getContexts(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context } = InputSchema.parse(input);

    switch (context) {
        case 'models':
            return await getModels();
        case 'routers':
            return await getRouters();
        default:
            throw new Error('Invalid context provided!');
    }
}