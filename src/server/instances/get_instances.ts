'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { InstanceDoc, ModelDoc, priorities, stepTypes, UserDoc } from "@/types/collections";
import { getSearchParams, SearchParams } from "@/lib/search_params";
import { ObjectId } from "mongodb";
import { Node } from "@/components/route_builder/types";

const InputSchema = z.object({
    modelId: z.string(),
    searchParams: z.custom<SearchParams>().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    step: z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(stepTypes),
    }).optional(),
    updatedAt: z.date(),
    updatedBy: z.string(),
}))

export async function getInstances(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { modelId, searchParams } = InputSchema.parse(input)

    const { updatedAt, search, priority, sortBy, sortOrder } = getSearchParams(searchParams);

    // filters
    const matchStage: any = {};
    if (updatedAt) {
        matchStage.updatedAt = {
            $gte: updatedAt.from,
            $lte: updatedAt.to
        };
    }

    if (search) {
        matchStage.number = { $regex: search, $options: 'i' }; // 'i' option makes the search case-insensitive
    }

    if (priority) {
        matchStage.priority = priority;
    }

    // sort
    const sortStage: any = {};
    if (sortBy) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const instanceCollection = db.collection<InstanceDoc>(modelId);
    const usersCollection = db.collection<UserDoc>('users');

    const pipeline: any[] = [{ $match: matchStage }];

    if (sortBy === 'priority') {
        pipeline.push(
            {
                $addFields: {
                    priorityOrder: {
                        $indexOfArray: [priorities, '$priority']
                    }
                }
            },
            {
                $sort: { priorityOrder: sortOrder === 'asc' ? 1 : -1 }
            },
            {
                $project: {
                    priorityOrder: 0
                }
            }
        );
    } else if (sortBy) {
        pipeline.push({
            $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
        });
    }

    const instances = await instanceCollection
        .aggregate(pipeline)
        .toArray();

    const modelCollection = db.collection<ModelDoc>('models');

    const res = await Promise.all(instances.map(async instance => {
        const updatedBy = await usersCollection.findOne({ _id: instance.updatedById });

        const model = await modelCollection.findOne({ _id: new ObjectId(modelId) });
        if (!model) throw new Error('Model not found');
        let step: Node | undefined;
        if (model.route) {
            step =
                model.route.nodes.find(node => node.id === instance.stepId)
                || model.route.nodes.find(node => node.id === model.route?.startEdge?.targetId);
        }

        return {
            _id: instance._id.toString(),
            number: instance.number,
            priority: instance.priority,
            step,
            updatedAt: instance.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : 'Unknown',
        }
    }))

    return OutputSchema.parse(res);
}