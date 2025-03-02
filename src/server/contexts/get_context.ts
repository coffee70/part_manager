'use server'
import { contexts } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { getModel } from "../models/get_model";
import { getRouter } from "../routers/get_router";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string().nullable().optional(),
})

export async function getContext(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id } = InputSchema.parse(input);
    if (!id) throw new Error ('ID is required');

    switch (context) {
        case 'models':
            return await getModel({ modelId: id });
        case 'routers':
            return await getRouter({ routerId: id });
        default:
            throw new Error('Invalid context provided!');
    }
}