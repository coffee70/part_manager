'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc, priorities, ValuesSchema, KVValuesSchema, NextServerSearchParamsSchema } from "@/types/collections";
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

const InputSchema = z.object({
    id: z.string(),
    instanceId: z.string().nullable().optional(),
    searchParams: NextServerSearchParamsSchema.optional(),
})

const OutputSchema = z.object({
    _id: z.custom<ObjectId>().transform(value => value.toString()),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    notes: z.string(),
    values: ValuesSchema,
    kv_values: KVValuesSchema.optional(),
}).nullable()

export async function getInstance(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { id, instanceId, searchParams } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');

    const { updatedAt, search, number, priority, steps, routeStatus, sortBy, sortOrder, link, customField, hideCompleted } = getSearchParams(searchParams);

    const instanceCollection = db.collection<InstanceDoc>(id);

    const pipeline: any[] = [];

    // Restrict to the specific instance first
    pipeline.push({ $match: { _id: new ObjectId(instanceId) } });

    // Steps pre-processing
    const stepsBuild = filterSteps(steps, pipeline);
    if (stepsBuild.addFieldsStages) pipeline.push(...stepsBuild.addFieldsStages);

    // Link lookups
    const linkBuild = filterLink(link, pipeline);
    if (linkBuild.preMatchStages) pipeline.push(...linkBuild.preMatchStages);

    // Build match stage
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

    const orConditions: any[] = [];
    if (stepsBuild.orConditions) orConditions.push(...stepsBuild.orConditions);
    if (routeStatusBuild.orConditions) orConditions.push(...routeStatusBuild.orConditions);
    if (orConditions.length > 0) matchStage.$or = orConditions;

    if (linkBuild.linkMatchConditions && linkBuild.linkMatchConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({ $or: linkBuild.linkMatchConditions });
    }

    const customFieldBuild = filterCustomField(customField, pipeline);
    if (customFieldBuild.andConditions && customFieldBuild.andConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push(...customFieldBuild.andConditions);
    }

    pipeline.push({ $match: matchStage });

    // Cleanup temporary link fields
    if (linkBuild.cleanupProjectFields && linkBuild.cleanupProjectFields.length > 0) {
        const fieldsToRemove: Record<string, number> = {};
        for (const field of linkBuild.cleanupProjectFields) fieldsToRemove[field] = 0;
        pipeline.push({ $project: fieldsToRemove });
    }

    // Sorting (should not change a single-result, but apply for consistency)
    applySort(sortBy, sortOrder, pipeline);

    const results = await instanceCollection.aggregate<InstanceDoc>(pipeline).toArray();

    if (results.length === 0) return null;
    if (results.length > 1) throw new Error("Multiple instances returned for given id with filters; database inconsistency");

    return OutputSchema.parse(results[0]);
}