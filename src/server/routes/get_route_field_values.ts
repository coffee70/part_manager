'use server'
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { fieldtypes, InstanceDoc } from "@/types/collections";

const InputSchema = z.object({
    stepId: z.string().nullable(),
    modelId: z.string(),
    modelInstanceId: z.string(),
});

const OutputSchema = z.array(z.object({
    _id: z.string(),
    name: z.string(),
    fields: z.array(z.object({
        _id: z.string(),
        sectionId: z.string(),
        type: z.enum(fieldtypes),
        name: z.string(),
        description: z.string(),
        options: z.array(z.string()).optional(),
        multiple: z.boolean().optional(),
        creative: z.boolean().optional(),
        default: z.string().optional(),
        value: z.string().optional(),
    })),
}));

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
        return [];
    }

    // Combine route_fields with values from the node
    const result = routerInstance.route_fields.map((section) => {
        return {
            _id: section._id.toString(),
            name: section.name,
            fields: section.fields.map((field) => {
                return {
                    _id: field._id.toString(),
                    sectionId: field.sectionId,
                    type: field.type,
                    name: field.name,
                    description: field.description,
                    options: field.options,
                    multiple: field.multiple,
                    creative: field.creative,
                    default: field.default,
                    value: matchingNode.values?.[field._id.toString()]
                };
            })
        };
    });

    // Validate result against OutputSchema
    return OutputSchema.parse(result);
} 