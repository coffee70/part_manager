'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { InstanceDoc, ModelDoc, priorities, stepTypes, UserDoc } from "@/types/collections";
import { getSearchParams, SearchParams } from "@/lib/search_params";
import { getCurrentStep } from "../routes/get_current_step";
const InputSchema = z.object({
    id: z.string(),
    searchParams: z.custom<SearchParams>().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    step: z.object({
        _id: z.string(),
        name: z.string(),
        type: z.enum(stepTypes),
    }).optional(),
    updatedAt: z.date(),
    updatedBy: z.string(),
}))

export async function getInstances(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, searchParams } = InputSchema.parse(input)

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

    const instanceCollection = db.collection<InstanceDoc>(id);
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

    const res = await Promise.all(instances.map(async instance => {
        const updatedBy = await usersCollection.findOne({ _id: instance.updatedById });

        const currentStep = await getCurrentStep({ modelId: id, instanceId: instance._id.toString() });

        return {
            _id: instance._id.toString(),
            number: instance.number,
            priority: instance.priority,
            step: currentStep,
            updatedAt: instance.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : 'Unknown',
        }
    }))

    return OutputSchema.parse(res);
}