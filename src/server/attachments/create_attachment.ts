'use server'
import { db } from "@/lib/mongo/db";
import { AttachableDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { z } from "zod";

export async function createAttachment(formData: FormData) {
    const { file, collection, modelId } = z.object({
        file: z.custom<File>(),
        collection: z.string(),
        modelId: z.string()
    }).parse({
        file: formData.get('file'),
        collection: formData.get('collection'),
        modelId: formData.get('modelId')
    })

    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized')

    if (!modelId) {
        throw new Error('No model id provided')
    }
    const _id = new ObjectId(modelId)
    
    const attachable = db.collection<AttachableDoc>(collection)
    const attachmentId = new ObjectId()

    attachable.updateOne(
        {
            _id: _id
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