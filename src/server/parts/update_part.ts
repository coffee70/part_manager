'use server'
import { Part } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

type Input = {
    part: Part;
}

export async function updatePart(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { part } = validators.input<Input>(input);

    const partsCollection = db.collection('parts');

    await partsCollection.updateOne(
        {
            _id: new ObjectId(part._id)
        },
        {
            $set: {
                number: part.number,
                notes: part.notes,
                values: part.values,
                updatedAt: new Date(),
                updatedById: user._id
            }
        });
}