'use server'

import { db } from "@/lib/mongo/db";
import { Priority, SerialDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { z } from "zod";

const OutputSchema = z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.custom<Priority>(),
    notes: z.string(),
    attachments: z.array(z.object({
        name: z.string(),
        url: z.string()
    })),
    values: z.record(z.union([z.string(), z.array(z.string())]))
}).nullable();

export async function getSerial({ _id }: { _id?: string | null }) {
    const serialsCollection = db.collection<SerialDoc>('serials');

    // if no id is provided, redirect to the first customer order so the URL is formed correctly
    // since alot of frontend functionality relies on the id being present in the URL
    if (!_id) {
        const serial = await serialsCollection.findOne();
        if (!serial) {
            return null;
        }

        _id = serial._id.toString();

        redirect(`/serials/?id=${_id}`);
    }

    const serial = await serialsCollection.findOne({ _id: new ObjectId(_id) });

    if (!serial) {
        throw new Error(`Serial with id ${_id} not found`);
    }

    const res = {
        ...serial,
        attachments: serial.attachments?.map(attachment => ({
            name: attachment.filename,
            url: process.env.FILE_GET_URL as string + attachment._id
        })) || []
    }

    const serialized = JSON.parse(JSON.stringify(res));

    return OutputSchema.parse(serialized);
}
    