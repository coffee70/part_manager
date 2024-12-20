'use server'
import { db } from '@/lib/db';
import { CommentableDoc, CommentDoc, Create, SectionCollection } from '@/types/collections'
import { validators } from '../validators/validators';
import { ObjectId } from 'mongodb';
import { getCurrentSession } from '../auth/get_current_session';

type Input = {
    id: string | null;
    collection: SectionCollection;
    text: string;
}

export async function createComment(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, collection: _collection, text } = validators.input<Input>(input);

    if (!id) {
        throw new Error('id is required');
    }

    const collection = db.collection<CommentableDoc>(_collection);
    await collection.updateOne({ _id: new ObjectId(id) }, {
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