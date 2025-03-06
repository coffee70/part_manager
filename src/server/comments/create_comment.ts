'use server'
import { db } from '@/lib/db';
import { CommentableDoc, contexts } from '@/types/collections'
import { ObjectId } from 'mongodb';
import { getCurrentSession } from '../auth/get_current_session';
import { z } from 'zod';
import { isCommentable } from '../contexts/is_commentable';

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable(),
    text: z.string(),
})

export async function createComment(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id, instanceId, text } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    if (!await isCommentable({ context, id })) {
        throw new Error(`Cannot comment on ${context} ${id}`);
    }

    const collection = db.collection<CommentableDoc>(id);
    await collection.updateOne({ _id: new ObjectId(instanceId) }, {
        $push: {
            comments: {
                _id: new ObjectId(),
                text: text,
                userId: user._id,
                updatedAt: new Date(),
            }
        },
        $set: {
            updatedAt: new Date(),
            updatedById: user._id
        }
    });
}