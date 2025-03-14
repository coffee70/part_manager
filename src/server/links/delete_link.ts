'use server'
import { db } from "@/lib/db";
import { LinkableDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    linkId: z.string(),
})

export async function deleteLink(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, instanceId, linkId } = InputSchema.parse(input);
    if (!instanceId) throw new Error(`No instanceId provided`);

    const instanceCollection = db.collection<LinkableDoc>(id);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) throw new Error(`Instance not found`);

    // find the link
    const link = instance.links.find(link => link._id.toString() === linkId);
    if (!link) throw new Error(`No link found with id ${linkId}`);

    // remove the link on the source
    await instanceCollection.updateOne(
        { _id: new ObjectId(instanceId) },
        { $pull: { links: { _id: new ObjectId(linkId) } } }
    );

    // remove the link on the target
    const linkedCollection = db.collection<LinkableDoc>(link.contextId);
    await linkedCollection.updateOne(
        { _id: new ObjectId(link.instanceId) },
        { $pull: { links: { contextId: id, instanceId } } }
    );

    return { linkContextId: link.contextId, linkInstanceId: link.instanceId };
}