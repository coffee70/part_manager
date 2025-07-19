'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { InstanceDoc, KVValuesSchema, priorities, stepTypes, UserDoc, ValuesSchema, contexts, ModelDoc, RouterDoc } from "@/types/collections";
import { getSearchParams, SearchParams } from "@/lib/search_params";
import { RouteState } from "@/components/route_builder/list_view/types";
import { getInstance } from "./get_instance";
import { getLinksByContextIds } from "../links/get_links_by_context_ids";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
    id: z.string(),
    context: z.enum(contexts),
    searchParams: z.custom<SearchParams>().optional(),
})

const OutputSchema = z.array(z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    route: z.object({
        state: z.nativeEnum(RouteState),
        currentStep: z.object({
            id: z.string(),
            name: z.string(),
            type: z.enum(stepTypes),
        }).optional(),
    }).optional(),
    updatedAt: z.date(),
    updatedBy: z.string(),
    values: ValuesSchema,
    kv_values: KVValuesSchema,
    links: z.array(z.object({
        _id: z.string(),
        contextId: z.string(),
        instanceId: z.string(),
        number: z.string(),
    })).optional(),
}))

export async function getInstances(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, context, searchParams } = InputSchema.parse(input)

    const { updatedAt, search, priority, steps, routeStatus, sortBy, sortOrder } = getSearchParams(searchParams);

    // Get table configuration for links
    let linksColumnConfig: { contextIds: string[], maxLinksPerContext: number } | null = null;
    
    if (context === 'models') {
        const modelsCollection = db.collection<ModelDoc>('models');
        const modelDoc = await modelsCollection.findOne({ _id: new ObjectId(id) });
        if (modelDoc?.tableConfiguration?.systemColumns) {
            const linksColumn = modelDoc.tableConfiguration.systemColumns.find(col => 
                'column' in col && col.column === 'links'
            );
            if (linksColumn && 'contextIds' in linksColumn && 'maxLinksPerContext' in linksColumn) {
                linksColumnConfig = {
                    contextIds: linksColumn.contextIds,
                    maxLinksPerContext: linksColumn.maxLinksPerContext
                };
            }
        }
    } else if (context === 'routers') {
        const routersCollection = db.collection<RouterDoc>('routers');
        const routerDoc = await routersCollection.findOne({ _id: new ObjectId(id) });
        if (routerDoc?.tableConfiguration?.systemColumns) {
            const linksColumn = routerDoc.tableConfiguration.systemColumns.find(col => 
                'column' in col && col.column === 'links'
            );
            if (linksColumn && 'contextIds' in linksColumn && 'maxLinksPerContext' in linksColumn) {
                linksColumnConfig = {
                    contextIds: linksColumn.contextIds,
                    maxLinksPerContext: linksColumn.maxLinksPerContext
                };
            }
        }
    }

    // filters
    const pipeline: any[] = [];

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

    // Create conditions for OR relationship
    const orConditions = [];
    
    if (steps) {
        pipeline.push({
            $addFields: {
                currentStepInstanceId: {
                    $let: {
                        vars: {
                            matchingNode: {
                                $arrayElemAt: [
                                    { $filter: { 
                                        input: "$route.nodes", 
                                        as: "node", 
                                        cond: { $eq: ["$$node.id", "$route.currentStepId"] } 
                                    }},
                                    0
                                ]
                            }
                        },
                        in: "$$matchingNode.instanceId"
                    }
                }
            }
        });

        if (Array.isArray(steps)) {
            orConditions.push({ currentStepInstanceId: { $in: steps } });
        } else {
            orConditions.push({ currentStepInstanceId: steps });
        }
    }

    if (routeStatus) {
        if (Array.isArray(routeStatus)) {
            orConditions.push({ 'route.state': { $in: routeStatus } });
        } else {
            orConditions.push({ 'route.state': routeStatus });
        }
    }

    // Add OR conditions to match stage if any exist
    if (orConditions.length > 0) {
        matchStage.$or = orConditions;
    }

    // sort
    const sortStage: any = {};
    if (sortBy) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const instanceCollection = db.collection<InstanceDoc>(id);
    const usersCollection = db.collection<UserDoc>('users');

    pipeline.push({ $match: matchStage });

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
        .aggregate<InstanceDoc>(pipeline)
        .toArray();

    const res = await Promise.all(instances.map(async instance => {
        const updatedBy = await usersCollection.findOne({ _id: instance.updatedById });

        let currentStep;
        if (instance.route) {
            const route = instance.route;
            let currentNode = route.nodes.find(node => node.id === route.currentStepId);
            if (currentNode) {
                let routerInstance = await getInstance({ id: route.routerId, instanceId: currentNode.instanceId })
                if (routerInstance) {
                    currentStep = {
                        id: currentNode.id,
                        instanceId: routerInstance._id.toString(),
                        name: routerInstance.number,
                        type: 'In-progress',
                    }
                }
            }
        }

        // Fetch links if configuration exists
        let links: any[] = [];
        if (linksColumnConfig) {
            try {
                links = await getLinksByContextIds({
                    contextId: id,
                    instanceId: instance._id.toString(),
                    contextIds: linksColumnConfig.contextIds,
                    maxLinksPerContext: linksColumnConfig.maxLinksPerContext
                });
            } catch (error) {
                console.error('Error fetching links for instance:', instance._id, error);
                links = [];
            }
        }

        return {
            _id: instance._id.toString(),
            number: instance.number,
            priority: instance.priority,
            route: instance.route ? {
                state: instance.route.state,
                currentStep: currentStep
            } : undefined,
            updatedAt: instance.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : 'Unknown',
            values: instance.values,
            kv_values: instance.kv_values,
            links: links.length > 0 ? links : undefined,
        }
    }))

    return OutputSchema.parse(res);
}