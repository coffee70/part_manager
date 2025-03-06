'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { AttachableDoc, contexts } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getAttachment } from "./get_attachment";
import { isAttachable } from "../contexts/is_attachable";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.string(),
    name: z.string(),
    base64: z.string(),
    type: z.string(),
}))

export async function getAttachments(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error('instance Id is required');

    if (!await isAttachable({ context, id })) {
        return [];
    }

    const instanceCollection = db.collection<AttachableDoc>(id);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) throw new Error('Instance not found');

    const attachments = await Promise.all(instance.attachments?.map(async attachment => {
        const blob = await getAttachment({ _id: attachment._id.toString() });
        const type = blob.type;
        const arrayBuffer = await blob.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64');

        return {
            _id: attachment._id.toString(),
            name: attachment.filename,
            base64: base64String,
            type
        }
    }) || []);

    return OutputSchema.parse(attachments);
}