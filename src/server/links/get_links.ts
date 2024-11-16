'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/mongo/db";
import { LinkableDoc } from "@/types/collections";
import { collectionToUrl } from "@/lib/conversions";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    modelId?: string | null;
    model: string;
}

export async function getLinks(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, model } = input;
    if (!modelId) throw new Error('No modelId provided');

    const collection = db.collection<LinkableDoc>(model);
    const document = await collection.findOne({ _id: new ObjectId(modelId) });

    if (!document || !document.links) {
        return [];
    }

    const links = await Promise.all(document.links.map(async link => {
        const collection = db.collection<{ number: string }>(link.model);
        const doc = await collection.findOne({ _id: new ObjectId(link.modelId) });
        if (!doc) return null;

        return {
            _id: link._id.toString(),
            name: doc.number,
            href: `/${collectionToUrl[link.model]}?id=${link.modelId}`,
            model: link.model,
        }
    }))

    return links.filter(link => link !== null);
}