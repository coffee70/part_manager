'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { validate } from "@/lib/validators/server_actions";
import { contexts } from "@/types/collections";
import { hasPriority as modelHasPriority } from "../models/has_priority";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
})

export async function hasPriority(
    input: z.input<typeof InputSchema>
): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return false;

    const { context, id } = validation.data;

    // Only models have priorities, routers don't
    if (context !== 'models') {
        return false;
    }

    return modelHasPriority({ modelId: id });
} 