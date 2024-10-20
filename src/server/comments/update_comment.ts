'use server'

import { Commentable, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";

type Input = {
    modelId: string | null;
    collection: SectionCollection;
    commentId: string;
    text: string;
}

export async function updateComment(input: Input) {
    const { modelId, collection: _collection, commentId, text } = validators.input<Input>(input);

    if (!modelId) {
        throw new Error('id is required');
    }

    const db = client.db('test');
    const collection = db.collection<Commentable>(_collection)
    await collection.updateOne({ _id: new ObjectId(modelId), 'comments._id': new ObjectId(commentId) }, { $set: { 'comments.$.text': text } })
}