'use server'
import { db } from "@/lib/db";
import { Priority, SerialDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { getAttachment } from "../attachments/get_attachment";

const OutputSchema = z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.custom<Priority>(),
    notes: z.string(),
    attachments: z.array(z.object({
        _id: z.string(),
        name: z.string(),
        base64: z.string(),
        type: z.string()
    })),
    values: z.record(z.union([z.string(), z.array(z.string())]))
}).nullable();

export async function getSerial({ _id }: { _id?: string | null }) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

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

    const attachments = await Promise.all(
        serial.attachments?.map(async (attachment) => {
            const blob = await getAttachment({ _id: attachment._id.toString() });
            const arrayBuffer = await blob.arrayBuffer();
            const base64String = Buffer.from(arrayBuffer).toString('base64');

            return {
                _id: attachment._id.toString(),
                name: attachment.filename,
                base64: base64String,
                type: blob.type
            };
        }) || []
    );

    const res = {
        ...serial,
        _id: serial._id.toString(),
        attachments,
    }

    return OutputSchema.parse(res);
}
