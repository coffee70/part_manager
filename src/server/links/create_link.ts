'use server'
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
import { InstanceDoc, LinkableDoc } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session"
import { z } from "zod"
import { ActionState } from "@/lib/validators/server_actions"
import { isLinkable } from "../models/is_linkable"

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string().nullable().optional(),
    linkedModelId: z.string(),
    linkedInstanceNumber: z.string(),
})

const OutputSchema = z.object({
    linkedModelId: z.string(),
    linkedInstanceId: z.string(),
})

export async function createLink(
    input: z.input<typeof InputSchema>
): Promise<ActionState<
    typeof InputSchema,
    typeof OutputSchema
>> {
    const { user } = await getCurrentSession();
    if (!user) return { success: false, error: 'Unauthorized!' };

    const { modelId, instanceId, linkedModelId, linkedInstanceNumber } = InputSchema.parse(input);
    if (!instanceId) return { success: false, error: 'Instance ID is required!' };

    if (!await isLinkable({ modelId })) {
        throw new Error('Model is not linkable!');
    }

    const linkedCollection = db.collection<LinkableDoc & InstanceDoc>(linkedModelId);

    // get the id of the linked model
    const linkedDocument = await linkedCollection.findOne({ number: linkedInstanceNumber });
    // if the linked model doesn't exist, return an error
    if (!linkedDocument) {
        return { success: false, error: "Linked instance not found!" };
    }
    const linkedInstanceId = linkedDocument._id.toString();

    // prevent self linking
    if (instanceId === linkedInstanceId && modelId === linkedModelId) {
        return { success: false, error: "Cannot link an instance to itself!" };
    }

    // create the link on both models
    await link({
        sourceModelId: modelId,
        sourceInstanceId: instanceId,
        targetModelId: linkedModelId,
        targetInstanceId: linkedInstanceId
    });
    await link({
        sourceModelId: linkedModelId,
        sourceInstanceId: linkedInstanceId,
        targetModelId: modelId,
        targetInstanceId: instanceId
    });

    return { success: true, data: { linkedModelId, linkedInstanceId } };
}

async function link({
    sourceModelId,
    sourceInstanceId,
    targetModelId,
    targetInstanceId
}: {
    sourceModelId: string;
    sourceInstanceId: string;
    targetModelId: string;
    targetInstanceId: string;
}) {
    const sourceCollection = db.collection<LinkableDoc>(sourceModelId);

    const sourceInstance = await sourceCollection.findOne({ _id: new ObjectId(sourceInstanceId) });
    if (!sourceInstance
        || !sourceInstance.links
        || !sourceInstance.links.some(link => link.modelId === targetModelId && link.instanceId === targetInstanceId)) {
        await sourceCollection.updateOne({ _id: new ObjectId(sourceInstanceId) }, {
            $addToSet: {
                links: {
                    _id: new ObjectId(),
                    modelId: targetModelId,
                    instanceId: targetInstanceId
                }
            }
        });
    }
}