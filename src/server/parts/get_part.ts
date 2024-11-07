'use server'

import { db } from "@/lib/mongo/db";
import { PartDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { z } from "zod"

const OutputSchema = z.object({
    _id: z.string(),
    number: z.string(),
    notes: z.string(),
    attachments: z.array(z.object({
        name: z.string(),
        url: z.string()
    })),
    values: z.record(z.union([z.string(), z.array(z.string())]))
}).nullable();

export async function getPart({ _id }: { _id?: string | null }) {
    const partsCollection = db.collection<PartDoc>('parts');
    
    // if no id is provided, redirect to the first part so the URL is formed correctly
    // since alot of frontend functionality relies on the id being present in the URL
    if (!_id) {
        const part = await partsCollection.findOne();
        if (!part) {
            return null;
        }

        _id = part._id.toString();

        redirect(`/parts/?id=${_id}`);
    }

    const part = await partsCollection.findOne({ _id: new ObjectId(_id) })

    if (!part) {
        throw new Error(`Part with id ${_id} not found`);
    }

    const res = {
        ...part,
        attachments: part.attachments?.map(attachment => ({
            name: attachment.filename,
            url: process.env.FILE_GET_URL as string + attachment._id
        })) || []
    }

    const serialized = JSON.parse(JSON.stringify(res));
    
    return OutputSchema.parse(serialized);
}