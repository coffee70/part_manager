'use server'
import { db } from "@/lib/db";
import { LinkableDoc, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    modelId: string | null;
    model: SectionCollection;
    linkId: string;
}

export async function deleteLink(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, model, linkId } = validators.input<Input>(input);

    if (!modelId) {
        throw new Error(`No modelId provided`);
    }

    const collection = db.collection<LinkableDoc>(model);
    const document = await collection.findOne({ _id: new ObjectId(modelId) });
    if (!document) {
        throw new Error(`No ${model} found with id ${modelId}`);
    }

    // find the link
    const link = document.links.find(link => link._id.toString() === linkId);
    if (!link) {
        throw new Error(`No link found with id ${linkId}`);
    }

    // remove the link on the source
    await collection.updateOne(
        { _id: new ObjectId(modelId) },
        { $pull: { links: { _id: new ObjectId(linkId) } } }
    );

    // remove the link on the target
    const linkedCollection = db.collection<LinkableDoc>(link.model);
    const { upsertedId } = await linkedCollection.updateOne(
        { _id: new ObjectId(link.modelId) },
        { $pull: { links: { model: model, modelId: modelId } } }
    );

    return { upsertedId: upsertedId?.toString() };
}