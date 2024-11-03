'use server'
import client from "@/lib/mongo/db";
import { AttachableDoc, AttachmentCollection } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

export async function createAttachment({
    file,
    collection,
    modelId
}: {
    file: File;
    collection: AttachmentCollection;
    modelId: string | null;
}) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized')

    if (!modelId) {
        throw new Error('No model id provided')
    }
    const _id = new ObjectId(modelId)
    const db = client.db('test')
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