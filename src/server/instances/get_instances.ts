'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { InstanceDoc, priorities, UserDoc, contexts, ModelDoc, RouterDoc, InstanceSchema } from "@/types/collections";
import { getSearchParams, SearchParams } from "@/lib/search_params";
import { getInstance } from "./get_instance";
import { getLinksByContextIds } from "../links/get_links_by_context_ids";

import { ObjectId } from "mongodb";

const InputSchema = z.object({
    id: z.string(),
    context: z.enum(contexts),
    searchParams: z.custom<SearchParams>().optional(),
})

const OutputSchema = z.array(InstanceSchema)

export async function getInstances(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, context, searchParams } = InputSchema.parse(input)

    const { updatedAt, search, number, priority, steps, routeStatus, sortBy, sortOrder, link } = getSearchParams(searchParams);

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

    // Handle steps filtering first (needs to add fields before other matches)
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
    }

    // Handle link filtering lookups before main match
    let linkMatchConditions: any[] = [];
    if (link && Object.keys(link).length > 0) {
        // Filter out empty values and prepare entries (keys are now context IDs)
        const linkFilterEntries = Object.entries(link)
            .map(([contextId, filterValue]) => ({
                contextId,
                filterValue: filterValue.trim()
            }))
            .filter(entry => entry.filterValue !== '');

        if (linkFilterEntries.length > 0) {
            // For each context we're filtering on, add lookup stages
            for (const { contextId, filterValue } of linkFilterEntries) {
                // Add lookup for this specific context
                pipeline.push({
                    $lookup: {
                        from: contextId,
                        let: { 
                            linkIds: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: { $ifNull: ["$links", []] },
                                            cond: { $eq: ["$$this.contextId", contextId] }
                                        }
                                    },
                                    as: "link",
                                    in: { $toObjectId: "$$link.instanceId" }
                                }
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $in: ["$_id", "$$linkIds"] },
                                    number: { $regex: filterValue, $options: 'i' }
                                }
                            },
                            { $project: { number: 1 } }
                        ],
                        as: `linkedInstances_${contextId}`
                    }
                });
            }

            // Prepare link match conditions for later use
            linkMatchConditions = linkFilterEntries.map(({ contextId }) => ({
                [`linkedInstances_${contextId}`]: { $ne: [] }
            }));
        }
    }

    // Build main match stage
    const matchStage: any = {};
    if (updatedAt) {
        matchStage.updatedAt = {
            $gte: updatedAt.from,
            $lte: updatedAt.to
        };
    }

    if (search) {
        matchStage.number = { $regex: search, $options: 'i' };
    }

    if (number) {
        matchStage.number = { $regex: number, $options: 'i' };
    }

    if (priority) {
        matchStage.priority = priority;
    }

    // Create conditions for OR relationship
    const orConditions = [];
    
    if (steps) {
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

    // Add link match conditions to main match stage
    if (linkMatchConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({ $or: linkMatchConditions });
    }

    // sort
    const sortStage: any = {};
    if (sortBy) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const instanceCollection = db.collection<InstanceDoc>(id);
    const usersCollection = db.collection<UserDoc>('users');

    pipeline.push({ $match: matchStage });

    // Remove temporary lookup fields used for link filtering
    if (linkMatchConditions.length > 0) {
        const fieldsToRemove: Record<string, number> = {};
        for (const condition of linkMatchConditions) {
            const fieldName = Object.keys(condition)[0];
            fieldsToRemove[fieldName] = 0;
        }
        pipeline.push({ $project: fieldsToRemove });
    }

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