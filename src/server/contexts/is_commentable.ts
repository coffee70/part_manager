'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { validate } from "@/lib/validators/server_actions";
import { contexts } from "@/types/collections";
import { isCommentable as model_isCommentable } from "../models/is_commentable";
import { isCommentable as router_isCommentable } from "../routers/is_commentable";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
})

export async function isCommentable(
    input: z.input<typeof InputSchema>
): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return false;

    const { context, id } = validation.data;

    switch (context) {
        case 'models':
            return await model_isCommentable({ modelId: id });
        case 'routers':
            return await router_isCommentable({ routerId: id });
        default:
            throw new Error('Invalid context');
    }
}