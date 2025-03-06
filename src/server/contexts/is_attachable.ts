'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { validate } from "@/lib/validators/server_actions";
import { contexts } from "@/types/collections";
import { isAttachable as model_isAttachable } from "../models/is_attachable";
import { isAttachable as router_isAttachable } from "../routers/is_attachable";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
})

export async function isAttachable(
    input: z.input<typeof InputSchema>
): Promise<boolean> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return false;

    const { context, id } = validation.data;

    switch (context) {
        case 'models':
            return await model_isAttachable({ modelId: id });
        case 'routers':
            return await router_isAttachable({ routerId: id });
        default:
            throw new Error('Invalid context');
    }
}