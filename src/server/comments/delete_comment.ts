'use server'
import { CommentableDoc, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    _id: string | null;
    collection: SectionCollection;
    commentId: string;
}

export async function deleteComment(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { _id, collection: _collection, commentId } = validators.input<Input>(input);

    if (!_id) {
        throw new Error('id is required');
    }

    const collection = db.collection<CommentableDoc>(_collection);

    // check the user is either an admin or the commenter
    const commentedModel = await collection.findOne(
        {
            _id: new ObjectId(_id),
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
        { _id: new ObjectId(_id) },
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