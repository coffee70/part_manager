'use server'
import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    notes: z.string(),
})

export async function updateNotes(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, instanceId, notes } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(id);
    await instanceCollection.updateOne({
        _id: new ObjectId(instanceId)
    }, {
        $set: {
            notes,
            updatedAt: new Date(),
            updatedById: user._id
        }
    });
}