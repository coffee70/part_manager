'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { LinkableDoc, InstanceDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    contextId: z.string(),
    instanceId: z.string(),
    contextIds: z.array(z.string()),
    maxLinksPerContext: z.number().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    contextId: z.string(),
    instanceId: z.string(),
    number: z.string(),
}))

export async function getLinksByContextIds(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { contextId, instanceId, contextIds, maxLinksPerContext } = InputSchema.parse(input);

    const instanceCollection = db.collection<LinkableDoc>(contextId);
    const document = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });

    if (!document || !document.links) {
        return [];
    }

    // Filter links to only include those whose contextId is in the provided contextIds list
    let filteredLinks = document.links.filter(link => 
        contextIds.includes(link.contextId)
    );

    // Apply maxLinksPerContext limit per context ID if specified
    if (maxLinksPerContext !== undefined) {
        // Group links by contextId
        const linksByContext: Record<string, typeof filteredLinks> = {};
        for (const link of filteredLinks) {
            if (!linksByContext[link.contextId]) {
                linksByContext[link.contextId] = [];
            }
            linksByContext[link.contextId].push(link);
        }

        // Limit each context to maxLinksPerContext and flatten
        filteredLinks = Object.values(linksByContext)
            .flatMap(linksInContext => linksInContext.slice(0, maxLinksPerContext));
    }

    // Fetch instance documents and include their numbers
    const linksWithNumbers = await Promise.all(filteredLinks.map(async (link) => {
        const linkInstanceCollection = db.collection<InstanceDoc>(link.contextId);
        const linkInstance = await linkInstanceCollection.findOne({ _id: new ObjectId(link.instanceId) });
        
        return {
            ...link,
            number: linkInstance?.number || 'Unknown'
        };
    }));

    return OutputSchema.parse(linksWithNumbers);
} 