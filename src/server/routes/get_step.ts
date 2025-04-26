import { db } from "@/lib/db";
import { InstanceDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { z } from "zod";

const InputSchema = z.object({
    modelId: z.string(),
    instanceId: z.string(),
    stepId: z.string(),
})

export async function getStep(input: z.infer<typeof InputSchema>) {
    const { modelId, instanceId, stepId } = InputSchema.parse(input);

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });

    if (!instance) {
        throw new Error("Instance not found");
    }
    
    return instance.route?.nodes.find(node => node.id === stepId);
}