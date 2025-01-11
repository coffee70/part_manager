'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { InstanceDoc, LinkableDoc, ModelDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    modelId: z.string(),
    instanceId: z.string(),
    number: z.string(),
    color: z.string(),
}))

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

    const modelCollection = db.collection<ModelDoc>('models');
    const links = await Promise.all(document.links.map(async link => {
        const linkedInstanceCollection = db.collection<InstanceDoc>(link.modelId);

        const linkedInstance = await linkedInstanceCollection.findOne({ _id: new ObjectId(link.instanceId) });
        if (!linkedInstance) throw new Error('Linked instance not found');

        const linkedModel = await modelCollection.findOne({ _id: new ObjectId(link.modelId) });
        if (!linkedModel) throw new Error('Linked model not found');

        return {
            ...link,
            number: linkedInstance.number,
            color: linkedModel.color,
        }
    }))

    return OutputSchema.parse(links);
}