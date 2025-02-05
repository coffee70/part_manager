'use server'
import { db } from "@/lib/db";
import { AttachableDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { z } from "zod";
import { isAttachable } from "../models/is_attachable";

const FormDataSchema = z.object({
    file: z.custom<File>(),
    modelId: z.string(),
    instanceId: z.string()
})

export async function createAttachment(formData: FormData) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized')

    const { file, modelId, instanceId } = FormDataSchema.parse(Object.fromEntries(formData))
    if (!instanceId) throw new Error('No instanceId provided');

    if (!await isAttachable({ modelId })) {
        throw new Error('Model is not attachable')
    }
    
    const instanceCollection = db.collection<AttachableDoc>(modelId)
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