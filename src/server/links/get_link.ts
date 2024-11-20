'use server'
import { LinkableDoc, SectionCollection } from "@/types/collections";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    modelId: string | null;
    model: SectionCollection;
    linkId: string;
}

export async function getLink(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, model, linkId } = validators.input<Input>(input);

    if (!modelId) throw new Error('Model id is required');

    const collection = db.collection<LinkableDoc>(model);
    const document = await collection.findOne({ _id: new ObjectId(modelId) });
    if (!document) throw new Error(`Document not found for model ${model} and id ${modelId}`);

    const link = document.links.find(({ _id }) => _id.toString() === linkId);

    if (!link) throw new Error(`Link not found for id ${linkId}`);

    return {
        model: link.model,
    };
}