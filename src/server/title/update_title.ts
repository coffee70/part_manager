'use server'
import client from "@/lib/mongo/db";
import { SectionCollection } from "@/types/collections";
import { ObjectId } from "mongodb";

type Input = {
    id: string | null;
    collection: SectionCollection;
    key: string;
    title: string;
}
export async function updateTitle({ id, collection: _collection, key, title }: Input) {
    if (!id) {
        throw new Error("No id provided")
    }
    
    const db = client.db('test')
    const collection = db.collection(_collection)

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { [key]: title }})
}