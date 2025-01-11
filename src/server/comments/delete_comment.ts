'use server'
import { CommentableDoc } from "@/types/collections";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
    commentId: z.string(),
})

export async function deleteComment(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId, commentId } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    const collection = db.collection<CommentableDoc>(modelId);

    // check the user is either an admin or the commenter
    const commentedModel = await collection.findOne(
        {
            _id: new ObjectId(instanceId),
            'comments._id': new ObjectId(commentId),
        },
        {
            projection: {
                'comments.$': 1
            }
        }
    )

    if (!commentedModel) {
        throw new Error('Comment not found!');
    }

    if (commentedModel.comments[0].userId !== user._id && user.role !== 'admin') {
        throw new Error('You are not authorized to delete this comment!');
    }

    await collection.updateOne(
        { _id: new ObjectId(instanceId) },
        {
            $pull: {
                comments: {
                    _id: new ObjectId(commentId)
                }
            },
            $set: {
                updatedAt: new Date(),
                updatedById: user._id
            }
        },
    );
}