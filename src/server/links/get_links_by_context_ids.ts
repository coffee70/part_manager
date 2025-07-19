'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { LinkableDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    contextId: z.string(),
    instanceId: z.string(),
    contextIds: z.array(z.string()),
})

const OutputSchema = z.array(z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    contextId: z.string(),
    instanceId: z.string(),
}))

export async function getLinksByContextIds(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { contextId, instanceId, contextIds } = InputSchema.parse(input);

    const instanceCollection = db.collection<LinkableDoc>(contextId);
    const document = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });

    if (!document || !document.links) {
        return [];
    }

    // Filter links to only include those whose contextId is in the provided contextIds list
    const filteredLinks = document.links.filter(link => 
        contextIds.includes(link.contextId)
    );

    return OutputSchema.parse(filteredLinks);
} 