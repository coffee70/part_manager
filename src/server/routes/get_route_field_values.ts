'use server'
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { FieldSchema, InstanceDoc, ValuesSchema, KVValuesSchema } from "@/types/collections";

const InputSchema = z.object({
    stepId: z.string().nullable(),
    modelId: z.string(),
    modelInstanceId: z.string(),
});

const OutputSchema = z.object({
    sections: z.array(z.object({
        _id: z.string(),
        name: z.string(),
        fields: z.array(FieldSchema),
    })),
    values: ValuesSchema,
    kv_values: KVValuesSchema,
});

export type RouteFieldValues = z.infer<typeof OutputSchema>;

export async function getRouteFieldValues(input: z.input<typeof InputSchema>): Promise<RouteFieldValues> {
    const { stepId, modelId, modelInstanceId } = InputSchema.parse(input);
    if (!stepId) {
        throw new Error('Step ID is required');
    }

    // Get the model instance document
    const modelInstanceCollection = db.collection<InstanceDoc>(modelId);
    const modelInstance = await modelInstanceCollection.findOne({
        _id: new ObjectId(modelInstanceId)
    });

    if (!modelInstance) {
        throw new Error(`Model instance not found with id: ${modelInstanceId}`);
    }

    if (!modelInstance.route) {
        throw new Error("Model instance does not have a route");
    }

    // Find the node matching the stepId
    const matchingNode = modelInstance.route.nodes.find(node => node.id === stepId);

    if (!matchingNode) {
        throw new Error(`Node not found with stepId: ${stepId}`);
    }

    // Get the router document using routerId from the route
    const routerId = modelInstance.route.routerId;
    const routerInstanceCollection = db.collection<InstanceDoc>(routerId);

    // Get the router instance using the instanceId from the matching node
    const routerInstanceId = matchingNode.instanceId;
    const routerInstance = await routerInstanceCollection.findOne({
        _id: new ObjectId(routerInstanceId)
    });

    if (!routerInstance) {
        throw new Error(`Router instance not found with id: ${routerInstanceId}`);
    }

    // Extract route_fields from the router
    if (!routerInstance.route_fields) {
        return OutputSchema.parse({
            sections: [],
            values: {},
            kv_values: {},
        });
    }

    // Format sections without attaching values
    const sections = routerInstance.route_fields.map((section) => {
        return {
            ...section,
            _id: section._id.toString(),
            fields: section.fields.map((field) => ({
                ...field,
                _id: field._id.toString(),
            }))
        };
    });

    const result = {
        sections,
        values: matchingNode.values || {},
        kv_values: matchingNode.kv_values || {},
    };

    // Validate result against OutputSchema
    return OutputSchema.parse(result);
} 