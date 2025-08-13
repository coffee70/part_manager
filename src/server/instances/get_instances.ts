'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { InstanceDoc, priorities, UserDoc, contexts, ModelDoc, RouterDoc, InstanceSchema, NextServerSearchParamsSchema } from "@/types/collections";
import { getSearchParams } from "@/lib/search_params";
import { filterSteps } from "@/lib/db_filter_sort/filter_steps";
import { filterLink } from "@/lib/db_filter_sort/filter_link";
import { filterHideCompleted } from "@/lib/db_filter_sort/filter_hide_completed";
import { filterUpdatedAt } from "@/lib/db_filter_sort/filter_updated_at";
import { filterSearch } from "@/lib/db_filter_sort/filter_search";
import { filterNumber } from "@/lib/db_filter_sort/filter_number";
import { filterPriority } from "@/lib/db_filter_sort/filter_priority";
import { filterRouteStatus } from "@/lib/db_filter_sort/filter_route_status";
import { filterCustomField } from "@/lib/db_filter_sort/filter_custom_field";
import { sort as applySort } from "@/lib/db_filter_sort/sort";
import { getInstance } from "./get_instance";
import { getLinksByContextIds } from "../links/get_links_by_context_ids";
import { ObjectId } from "mongodb";
import { RouteState } from "@/components/route_builder/list_view/types";

const InputSchema = z.object({
    id: z.string(),
    context: z.enum(contexts),
    searchParams: NextServerSearchParamsSchema.optional(),
})

const OutputSchema = z.array(InstanceSchema)

export async function getInstances(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, context, searchParams } = InputSchema.parse(input)

    const { updatedAt, search, number, priority, steps, routeStatus, sortBy, sortOrder, link, customField, hideCompleted } = getSearchParams(searchParams);

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

    // Apply modular filters
    // Steps (pre-match addFields + or)
    const stepsBuild = filterSteps(steps, pipeline);
    if (stepsBuild.addFieldsStages) pipeline.push(...stepsBuild.addFieldsStages);

    // Link (pre-match lookups)
    const linkBuild = filterLink(link, pipeline);
    if (linkBuild.preMatchStages) pipeline.push(...linkBuild.preMatchStages);

    // Build main match stage from all simple filters
    const matchStage: any = {};

    const hideCompletedBuild = filterHideCompleted(hideCompleted, pipeline);
    if (hideCompletedBuild.match) Object.assign(matchStage, hideCompletedBuild.match);

    const updatedAtBuild = filterUpdatedAt(updatedAt, pipeline);
    if (updatedAtBuild.match) Object.assign(matchStage, updatedAtBuild.match);

    const searchBuild = filterSearch(search, pipeline);
    if (searchBuild.match) Object.assign(matchStage, searchBuild.match);

    const numberBuild = filterNumber(number, pipeline);
    if (numberBuild.match) Object.assign(matchStage, numberBuild.match);

    const priorityBuild = filterPriority(priority, pipeline);
    if (priorityBuild.match) Object.assign(matchStage, priorityBuild.match);

    const routeStatusBuild = filterRouteStatus(routeStatus, pipeline);

    // OR conditions from steps and route status
    const orConditions: any[] = [];
    if (stepsBuild.orConditions) orConditions.push(...stepsBuild.orConditions);
    if (routeStatusBuild.orConditions) orConditions.push(...routeStatusBuild.orConditions);
    if (orConditions.length > 0) matchStage.$or = orConditions;

    // Link match conditions
    if (linkBuild.linkMatchConditions && linkBuild.linkMatchConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({ $or: linkBuild.linkMatchConditions });
    }

    // Custom field conditions (AND)
    const customFieldBuild = filterCustomField(customField, pipeline);
    if (customFieldBuild.andConditions && customFieldBuild.andConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push(...customFieldBuild.andConditions);
    }

    const instanceCollection = db.collection<InstanceDoc>(id);
    const usersCollection = db.collection<UserDoc>('users');

    pipeline.push({ $match: matchStage });

    // Cleanup temporary link fields
    if (linkBuild.cleanupProjectFields && linkBuild.cleanupProjectFields.length > 0) {
        const fieldsToRemove: Record<string, number> = {};
        for (const field of linkBuild.cleanupProjectFields) fieldsToRemove[field] = 0;
        pipeline.push({ $project: fieldsToRemove });
    }

    // Sorting
    applySort(sortBy, sortOrder, pipeline);

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
                let routerInstance = await getInstance({ id: route.routerId, instanceId: currentNode.instanceId, searchParams })
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