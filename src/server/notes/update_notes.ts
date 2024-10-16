'use server'
import client from "@/lib/mongo/db";
import { SectionCollection } from "@/types/collections";
import { ObjectId } from "mongodb";

type Input = {
    id: string | null;
    collection: SectionCollection;
    notes: string;
}

export async function updateNotes({ id, collection: _collection, notes }: Input) {
    if (!id) {
        throw new Error('No id provided');
    }
    const db = client.db('test');
    const collection = db.collection(_collection);
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { notes } });
}