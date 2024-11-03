'use server'

import { Commentable, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import client from "@/lib/mongo/db";
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

    const db = client.db('test');
    const collection = db.collection<Commentable>(_collection);

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