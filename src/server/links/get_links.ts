'use server'
import { ObjectId } from "mongodb";
import { db } from "@/lib/mongo/db";
import { LinkableDoc } from "@/types/collections";

type Input = {
    modelId: string | null;
    model: string;
}

export async function getLinks(input: Input) {
    const { modelId, model } = input;
    if (!modelId) throw new Error('No modelId provided');

    const collection = db.collection<LinkableDoc>(model);
    const document = await collection.findOne({ _id: new ObjectId(modelId) });

    if (!document || !document.links) {
        return [];
    }

    const links = await Promise.all(document.links.map(async link => {
        const collection = db.collection(link.model);
        const document = await collection.findOne({ _id: new ObjectId(link.modelId) });
        if (!document) return null;
        return {
            _id: link._id.toString(),
            href: `/${link.model}?id=${link.modelId}`,
            name: document.name
        };
    }));

    // Filter out null values
    return links.filter(link => link !== null);
}