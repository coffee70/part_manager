'use server'
import { AttachableDoc, LinkableDoc, SectionCollection } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { ObjectId } from "mongodb";
import { db } from "@/lib/mongo/db";
import { redirect } from "next/navigation";
import { collectionToUrl } from "@/lib/conversions";
import { deleteAttachment } from "../attachments/delete_attachment";
import { deleteLink } from "../links/delete_link";

type Input = {
    id: string | null;
    urlId: string | null;
    model: SectionCollection;
}

type Potentials = Partial<AttachableDoc & LinkableDoc>;

export async function deleteModel(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, urlId, model } = validators.input<Input>(input);

    if (!id) throw new Error('Invalid ID');

    const collection = db.collection(model);

    // get the document
    const document = await collection.findOne<Potentials>({ _id: new ObjectId(id) });
    if (!document) return;

    // delete the attachments
    if (document.attachments) {
        for (const attachment of document.attachments) {
            await deleteAttachment({
                id: attachment._id.toString(),
                modelId: id,
                model: model
            })
        }
    }

    // delete the links
    if (document.links) {
        for (const link of document.links) {
            await deleteLink({
                linkId: link._id.toString(),
                modelId: id,
                model: model
            })
        }
    }

    await collection.deleteOne({ _id: new ObjectId(id) });

    if (urlId === id) {
        redirect(`/${collectionToUrl[model]}`)
    }
}