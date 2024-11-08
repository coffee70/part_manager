'use server'

import { Serial } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { ObjectId } from "mongodb";

type Input = {
    serial: Serial;
}

export async function updateSerial(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const { serial } = validators.input<Input>(input);

    const serialsCollection = db.collection('serials');

    await serialsCollection.updateOne(
        {
            _id: new ObjectId(serial._id)
        },
        {
            $set: {
                number: serial.number,
                priority: serial.priority,
                notes: serial.notes,
                values: serial.values,
                updatedAt: new Date(),
                updatedById: user._id
            }
        });
}