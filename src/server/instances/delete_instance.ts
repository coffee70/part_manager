'use server'
import { AttachableDoc, InstanceDoc, LinkableDoc, contexts, NextServerSearchParamsSchema } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { deleteAttachment } from "../attachments/delete_attachment";
import { deleteLink } from "../links/delete_link";
import { z } from "zod";
import { router } from "@/lib/url";
import { serverToReadonlySearchParams } from "@/lib/search_params";
import { ActionState } from "@/lib/validators/server_actions";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    urlInstanceId: z.string().nullable().optional(),
    searchParams: NextServerSearchParamsSchema.optional(),
})

const OutputSchema = z.object({
    url: z.string(),
})

type Potentials = Partial<AttachableDoc & LinkableDoc>;

export async function deleteInstance(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema, typeof OutputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id, instanceId, urlInstanceId, searchParams } = InputSchema.parse(input);

    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(id);

    // get the document
    const document = await instanceCollection.findOne<Potentials>({ _id: new ObjectId(instanceId) });
    if (!document) return { success: false };

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
        const roParams = searchParams ? serverToReadonlySearchParams(searchParams) : undefined;
        const params = new URLSearchParams(roParams);
        params.delete('id');
        const urlWithParams = router().context(context).instances().context(id, params);
        return { success: true, data: { url: urlWithParams } };
    }

    return { success: true };
}