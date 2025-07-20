'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { InstanceDoc, LinkableDoc, contexts } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";
import { isLinkable } from "../contexts/is_linkable";
import { getContext } from "../contexts/get_context";

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    contextId: z.string(),
    instanceId: z.string(),
    number: z.string(),
    color: z.string(),
}))

export async function getLinks(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, id, instanceId } = input;
    if (!instanceId) throw new Error('No instance ID provided');

    if (!await isLinkable({ context, id })) {
        return [];
    } 

    const instanceCollection = db.collection<LinkableDoc>(id);
    const document = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });

    if (!document || !document.links) {
        return [];
    }

    let links = await Promise.all(document.links.map(async link => {
        const linkedInstanceCollection = db.collection<InstanceDoc>(link.contextId);

        const linkedInstance = await linkedInstanceCollection.findOne({ _id: new ObjectId(link.instanceId) });
        if (!linkedInstance) throw new Error('Linked instance not found');

        const linkedContext = await getContext({ context, id: link.contextId });
        if (!linkedContext) throw new Error('Linked context not found');

        if (!linkedContext.linkable) return;

        return {
            ...link,
            number: linkedInstance.number,
            color: linkedContext.color,
        }
    }))

    // Remove undefined links from the early return
    links = links.filter(link => link !== undefined);

    return OutputSchema.parse(links);
}