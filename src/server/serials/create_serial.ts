'use server'

import { Create, Serial, SerialDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { WithoutId } from "mongodb";

type Input = {
    serial: Create<Serial>;
}

export async function createSerial(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { serial } = validators.input<Input>(input);

    const serialsCollection = db.collection<WithoutId<SerialDoc>>('serials')

    await serialsCollection.insertOne({
        number: serial.number,
        priority: serial.priority,
        notes: serial.notes,
        values: serial.values,
        attachments: [],
        comments: [],
        updatedAt: new Date(),
        updatedById: user._id
    })
}