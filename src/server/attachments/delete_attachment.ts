'use server'
import { AttachableDoc, SectionCollection } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { ObjectId } from "mongodb";

type Input = {
    id: string | null;
    modelId: string | null;
    model: SectionCollection;
}

export async function deleteAttachment(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, modelId, model } = validators.input<Input>(input);

    if (!id) throw new Error('Invalid Attachment ID');
    if (!modelId) throw new Error('Invalid Model ID');

    const collection = db.collection<AttachableDoc>(model);

    // attempt to remove attachment in db
    await collection.updateOne({ _id: new ObjectId(modelId) }, {
        $pull: {
            attachments: {
                _id: new ObjectId(id)
            }
        },
        $set: {
            updatedAt: new Date(),
            updatedById: user._id
        }
    })

    // attempt to remove file in file-service
    await fetch(`${process.env.FILE_DELETE_URL}${id}`, {
        method: 'DELETE'
    })
}