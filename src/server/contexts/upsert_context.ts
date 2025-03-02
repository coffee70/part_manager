'use server'
import { z } from "zod"
import { upsertModel } from "../models/upsert_model";
import { upsertRouter } from "../routers/upsert_router";

const InputSchema = z.object({
    context: z.literal('models'),
    model: z.object({
        _id: z.string().optional(),
        name: z.string().min(1, { message: 'Name is required.' }),
        attachable: z.boolean(),
        linkable: z.boolean(),
        commentable: z.boolean(),
        priority: z.boolean(),
        color: z.string(),
    }),
}).or(z.object({
    context: z.literal('routers'),
    router: z.object({
        _id: z.string().optional(),
        name: z.string().min(1, { message: 'Name is required.' }),
        attachable: z.boolean(),
        linkable: z.boolean(),
        commentable: z.boolean(),
        color: z.string(),
    }),
}))

export async function upsertContext(input: z.input<typeof InputSchema>) {
    const data = InputSchema.parse(input);

    switch (data.context) {
        case 'models':
            return await upsertModel(data.model);
        case 'routers':
            return await upsertRouter(data.router);
        default:
            throw new Error('Invalid context provided!');
    }
}
