'use server'
import { AttachableDoc, InstanceDoc, LinkableDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { deleteAttachment } from "../attachments/delete_attachment";
import { deleteLink } from "../links/delete_link";
import { z } from "zod";
import { router } from "@/lib/url";

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    urlInstanceId: z.string().nullable().optional(),
})

type Potentials = Partial<AttachableDoc & LinkableDoc>;

export async function deleteInstance(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, instanceId, urlInstanceId } = InputSchema.parse(input);

    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(id);

    // get the document
    const document = await instanceCollection.findOne<Potentials>({ _id: new ObjectId(instanceId) });
    if (!document) return;

    // delete the attachments
    if (document.attachments) {
        for (const attachment of document.attachments) {
            await deleteAttachment({
                id, 
                instanceId, 
                attachmentId: attachment._id.toString()
            })
        }
    }

    // delete the links
    if (document.links) {
        for (const link of document.links) {
            await deleteLink({
                id,
                instanceId, 
                linkId: link._id.toString()
            })
        }
    }

    await instanceCollection.deleteOne({ _id: new ObjectId(instanceId) });

    if (urlInstanceId === instanceId) {
        redirect(router().models().instances().model(id));
    }
}