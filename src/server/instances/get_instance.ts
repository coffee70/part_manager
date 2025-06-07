'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc, priorities, ValuesSchema, KVValuesSchema } from "@/types/collections";

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
})

const OutputSchema = z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    notes: z.string(),
    values: ValuesSchema,
    kv_values: KVValuesSchema.optional(),
})

export async function getInstance(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    const instanceCollection = db.collection<InstanceDoc>(id);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
    if (!instance) throw new Error('Instance not found');
    
    return OutputSchema.parse({
        ...instance,
    });
}