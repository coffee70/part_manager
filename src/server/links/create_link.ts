'use server'
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
import { contexts, InstanceDoc, LinkableDoc, Context } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session"
import { z } from "zod"
import { ActionState } from "@/lib/validators/server_actions"
import { isLinkable } from "../contexts/is_linkable"

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    linkedId: z.string(),
    linkedInstanceNumber: z.string(),
})

const OutputSchema = z.object({
    linkedId: z.string(),
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

    const { context, id, instanceId, linkedId, linkedInstanceNumber } = InputSchema.parse(input);
    if (!instanceId) return { success: false, error: 'Instance ID is required!' };

    // Validate that both contexts are linkable
    if (!await isLinkable({ context, id })) {
        return { success: false, error: 'Source context is not linkable!' };
    }

    if (!await isLinkable({ context, id: linkedId })) {
        return { success: false, error: 'Target context is not linkable!' };
    }

    const linkedCollection = db.collection<LinkableDoc & InstanceDoc>(linkedId);

    // get the id of the linked model
    const linkedDocument = await linkedCollection.findOne({ number: linkedInstanceNumber });
    // if the linked model doesn't exist, return an error
    if (!linkedDocument) {
        return { success: false, error: "Linked instance not found!" };
    }
    const linkedInstanceId = linkedDocument._id.toString();

    // prevent self linking
    if (instanceId === linkedInstanceId && id === linkedId) {
        return { success: false, error: "Cannot link an instance to itself!" };
    }

    // create the link on both models
    await link({
        context,
        sourceId: id,
        sourceInstanceId: instanceId,
        targetId: linkedId,
        targetInstanceId: linkedInstanceId
    });
    await link({
        context,
        sourceId: linkedId,
        sourceInstanceId: linkedInstanceId,
        targetId: id,
        targetInstanceId: instanceId
    });

    return { success: true, data: { linkedId, linkedInstanceId } };
}

async function link({
    sourceId,
    sourceInstanceId,
    targetId,
    targetInstanceId
}: {
    context: Context;
    sourceId: string;
    sourceInstanceId: string;
    targetId: string;
    targetInstanceId: string;
}) {
    const sourceCollection = db.collection<LinkableDoc>(sourceId);

    const sourceInstance = await sourceCollection.findOne({ _id: new ObjectId(sourceInstanceId) });
    if (!sourceInstance
        || !sourceInstance.links
        || !sourceInstance.links.some(link => link.contextId === targetId && link.instanceId === targetInstanceId)) {
        await sourceCollection.updateOne({ _id: new ObjectId(sourceInstanceId) }, {
            $addToSet: {
                links: {
                    _id: new ObjectId(),
                    contextId: targetId,
                    instanceId: targetInstanceId
                }
            }
        });
    }
}