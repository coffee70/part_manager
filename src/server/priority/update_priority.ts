'use server'
import { Priority, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";

type Input = {
    id: string | null;
    collection: SectionCollection;
    priority: Priority;
}

export async function updatePriority(input: Input) {
    const { id, collection: _collection, priority } = validators.input<Input>(input);

    if (!id) throw new Error('id is required');

    const db = client.db('test');
    const collection = db.collection(_collection);

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { priority } });
}