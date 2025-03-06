'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { validate } from "@/lib/validators/server_actions";
import { contexts } from "@/types/collections";
import { isLinkable as model_isLinkable } from "../models/is_linkable";
import { isLinkable as router_isLinkable } from "../routers/is_linkable";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
})

export async function isLinkable(
    input: z.input<typeof InputSchema>
): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return false;

    const { context, id } = validation.data;

    switch (context) {
        case 'models':
            return await model_isLinkable({ modelId: id });
        case 'routers':
            return await router_isLinkable({ routerId: id });
        default:
            throw new Error('Invalid context');
    }
}