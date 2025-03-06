'use server'
import { db } from "@/lib/db";
import { AttachableDoc, contexts } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { z } from "zod";
import { isAttachable } from "../contexts/is_attachable";

const FormDataSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    file: z.custom<File>(),
    instanceId: z.string()
})

export async function createAttachment(formData: FormData) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized')

    const { file, context, id, instanceId } = FormDataSchema.parse(Object.fromEntries(formData))
    if (!instanceId) throw new Error('No instanceId provided');

    if (!await isAttachable({ context, id })) {
        throw new Error(`Cannot attach to ${context} ${id}`);
    }
    
    const instanceCollection = db.collection<AttachableDoc>(id)
    const attachmentId = new ObjectId()

    instanceCollection.updateOne(
        {
            _id: new ObjectId(instanceId)
        },
        {
            $push: {
                attachments: {
                    _id: attachmentId,
                    filename: file.name
                }
            },
            $set: {
                updatedAt: new Date(),
                updatedById: user._id
            }
        }
    )

    const data = new FormData()
    data.append('file', file, attachmentId.toString())

    const response = await fetch(process.env.FILE_POST_URL as string, {
        method: 'POST',
        body: data
    })

    if (!response.ok) {
        throw new Error('Failed to upload file: ' + response.statusText)
    }

    const json = await response.json()

    if (json.filename) {
        return json.filename
    } else {
        throw new Error('Failed to upload file: No filename returned')
    }
}