'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { InstanceDoc, LinkableDoc, ModelDoc } from "@/types/collections";
import { collectionToUrl } from "@/lib/conversions";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";
import { instanceURL } from "@/lib/url";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
})

export async function getLinks(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, instanceId } = input;
    if (!instanceId) throw new Error('No instance ID provided');

    const instanceCollection = db.collection<LinkableDoc>(modelId);
    const document = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });

    if (!document || !document.links) {
        return [];
    }

    const links = await Promise.all(document.links.map(async link => {
        const linkedCollection = db.collection<InstanceDoc>(link.modelId);
        const doc = await linkedCollection.findOne({ _id: new ObjectId(link.instanceId) });
        if (!doc) return null;

        const linkedModelCollection = db.collection<ModelDoc>('models');
        const linkedModel = await linkedModelCollection.findOne({ _id: new ObjectId(link.modelId) });
        if (!linkedModel) return null;
        
        return {
            _id: link._id.toString(),
            name: doc.number,
            href: instanceURL(link.modelId, link.instanceId),
            model: linkedModel.name,
        }
    }))

    return links.filter(link => link !== null);
}