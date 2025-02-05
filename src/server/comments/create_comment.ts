'use server'
import { db } from '@/lib/db';
import { CommentableDoc } from '@/types/collections'
import { ObjectId } from 'mongodb';
import { getCurrentSession } from '../auth/get_current_session';
import { z } from 'zod';
import { isCommentable } from '../models/is_commentable';

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable(),
    text: z.string(),
})

export async function createComment(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, text } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    if (!await isCommentable({ modelId })) {
        throw new Error('Model is not commentable');
    }

    const collection = db.collection<CommentableDoc>(modelId);
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