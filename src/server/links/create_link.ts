'use server'
import { db } from "@/lib/db"
import { validators } from "../validators/validators"
import { ObjectId } from "mongodb"
import { LinkableDoc, SectionCollection } from "@/types/collections"
import { collectionToName } from "@/lib/conversions"
import { getCurrentSession } from "../auth/get_current_session"

type Input = {
    model: SectionCollection;
    modelId: string | null;
    linkedModel: SectionCollection;
    linkedModelNumber: string;
}

export async function createLink(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { model, modelId, linkedModel, linkedModelNumber } = validators.input<Input>(input);

    if (!modelId) {
        throw new Error(`No modelId provided`);
    }

    const linkedCollection = db.collection<LinkableDoc & { number: string }>(linkedModel);

    // get the id of the linked model
    const linkedDocument = await linkedCollection.findOne({ number: linkedModelNumber });
    // if the linked model doesn't exist, throw an error
    if (!linkedDocument) {
        throw new Error(`No ${collectionToName[linkedModel]} found with number ${linkedModelNumber}`);
    }
    const linkedDocumentId = linkedDocument._id.toString();

    // prevent self linking
    if (modelId === linkedDocumentId && model === linkedModel) {
        throw new Error(`Cannot self link ${collectionToName[model]}!`);
    }

    // check if the link already exists on the source model
    if (await linkExists({ id: new ObjectId(modelId), model, linkId: linkedDocumentId, linkModel: linkedModel })) {
        // confirm that the link exists on the other model, otherwise create it
        if (!await linkExists({ id: new ObjectId(linkedDocumentId), model: linkedModel, linkId: modelId, linkModel: model })) {
            await link({ id: new ObjectId(linkedDocumentId), model: linkedModel, linkId: modelId, linkModel: model });
        }
        return { linkedDocumentId: linkedDocumentId }
    }

    // check if the link already exists on the target model
    if (await linkExists({ id: new ObjectId(linkedDocumentId), model: linkedModel, linkId: modelId, linkModel: model })) {
        // confirm that the link exists on the other model, otherwise create it
        if (!await linkExists({ id: new ObjectId(modelId), model, linkId: linkedDocumentId, linkModel: linkedModel })) {
            await link({ id: new ObjectId(modelId), model, linkId: linkedDocumentId, linkModel: linkedModel });
        }
        return { linkedDocumentId: linkedDocumentId }
    }

    // create the link on both models
    await link({ id: new ObjectId(modelId), model, linkId: linkedDocumentId, linkModel: linkedModel });
    await link({ id: new ObjectId(linkedDocumentId), model: linkedModel, linkId: modelId, linkModel: model });

    return { linkedDocumentId }

}

async function linkExists({
    id,
    model,
    linkId,
    linkModel
}: {
    id: ObjectId;
    model: SectionCollection;
    linkId: string;
    linkModel: SectionCollection;
}) {
    const collection = db.collection<LinkableDoc>(model);

    const document = await collection.findOne({ _id: id });
    if (!document || !document.links) {
        return false;
    }

    return document.links.some(link => link.model === linkModel && link.modelId === linkId);
}

async function link({
    id,
    model,
    linkId,
    linkModel
}: {
    id: ObjectId;
    model: SectionCollection;
    linkId: string;
    linkModel: SectionCollection;
}) {
    const collection = db.collection<LinkableDoc>(model);

    await collection.updateOne({ _id: id }, {
        $addToSet: {
            links: {
                _id: new ObjectId(),
                model: linkModel,
                modelId: linkId
            }
        }
    });
}