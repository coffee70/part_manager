'use server'
import { Priority, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    id: string | null;
    collection: SectionCollection;
    priority: Priority;
}

export async function updatePriority(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, collection: _collection, priority } = validators.input<Input>(input);

    if (!id) throw new Error('id is required');

    const collection = db.collection(_collection);

    await collection.updateOne({
        _id: new ObjectId(id)
    }, {
        $set: {
            priority,
            updatedAt: new Date(),
            updatedById: user._id
        }
    });
}