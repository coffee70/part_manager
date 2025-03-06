'use server'
import { AttachableDoc, contexts } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { z } from "zod";

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    attachmentId: z.string(),
})

export async function deleteAttachment(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, instanceId, attachmentId } = InputSchema.parse(input);

    if (!instanceId) throw new Error('instance Id is required');

    const instanceCollection = db.collection<AttachableDoc>(id);

    // attempt to remove attachment in db
    await instanceCollection.updateOne({ _id: new ObjectId(instanceId) }, {
        $pull: {
            attachments: {
                _id: new ObjectId(attachmentId)
            }
        },
        $set: {
            updatedAt: new Date(),
            updatedById: user._id
        }
    })

    // attempt to remove file in file-service
    await fetch(`${process.env.FILE_DELETE_URL}${attachmentId}`, {
        method: 'DELETE'
    })
}