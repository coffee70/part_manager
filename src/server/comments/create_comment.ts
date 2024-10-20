'use server'
import { Commentable, CommentDoc, Create, SectionCollection } from '@/types/collections'
import { validators } from '../validators/validators';
import client from '@/lib/mongo/db';
import { ObjectId } from 'mongodb';

type Input = {
    id: string | null;
    collection: SectionCollection;
    comment: Create<CommentDoc>;
}

export async function createComment(input: Input) {
    const { id, collection: _collection, comment } = validators.input<Input>(input);

    if (!id) {
        throw new Error('id is required');
    }

    const db = client.db('test');
    const collection = db.collection<Commentable>(_collection);
    await collection.updateOne({ _id: new ObjectId(id) }, {
        $push: {
            comments: {
                _id: new ObjectId(),
                updatedAt: new Date(),
                ...comment,
            }
        }
    });
}