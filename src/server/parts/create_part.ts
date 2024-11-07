'use server'
import { Create, Part } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/mongo/db";
import { validators } from "../validators/validators";

type Input = {
    part: Create<Part>;
}

export async function createPart(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { part } = validators.input<Input>(input)

    const partsCollection = db.collection('parts')

    await partsCollection.insertOne({
        number: part.number,
        notes: part.notes,
        values: part.values,
        attachments: [],
        comments: [],
        updatedAt: new Date(),
        updatedById: user._id
    })
}