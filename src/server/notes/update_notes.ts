'use server'
import { db } from "@/lib/db";
import { SectionCollection } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    id: string | null;
    collection: SectionCollection;
    notes: string;
}

export async function updateNotes({ id, collection: _collection, notes }: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    if (!id) {
        throw new Error('No id provided');
    }

    const collection = db.collection(_collection);
    await collection.updateOne({
        _id: new ObjectId(id)
    }, {
        $set: {
            notes,
            updatedAt: new Date(),
            updatedById: user._id
        }
    });
}