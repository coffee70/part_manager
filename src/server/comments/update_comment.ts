'use server'
import { CommentableDoc, contexts } from "@/types/collections";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";
import { isCommentable } from "../contexts/is_commentable";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    commentId: z.string(),
    text: z.string(),
})

export async function updateComment(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id, instanceId, commentId, text } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    if (!await isCommentable({ context, id })) {
        throw new Error('Model is not commentable');
    }

    const collection = db.collection<CommentableDoc>(id)

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
        throw new Error('You are not authorized to edit this comment!');
    }

    await collection.updateOne({
        _id: new ObjectId(instanceId),
        'comments._id': new ObjectId(commentId)
    }, {
        $set: {
            'comments.$.text': text,
            updatedAt: new Date(),
            updatedById: user._id
        }
    })
}