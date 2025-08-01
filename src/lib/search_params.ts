import { ReadonlyURLSearchParams } from "next/navigation"
import { z } from "zod"
import { NextServerSearchParams, Priority, sortKeys } from "@/types/collections"
import { RouteState } from "@/components/route_builder/list_view/types";

const UpdatedAt = z.object({
    to: z.coerce.date().optional(),
    from: z.coerce.date().optional(),
});

const LinkFilter = z.record(z.string(), z.string());

const CustomFieldFilter = z.record(z.string(), z.string());

export type SearchParams = NextServerSearchParams | ReadonlyURLSearchParams

export const getSearchParams = (searchParams?: SearchParams) => {
    // convert client side ReadOnlySearchParams to server side type
    let params: NextServerSearchParams;
    if (searchParams instanceof ReadonlyURLSearchParams) {
        params = convertSearchParams(searchParams)
    }
    else if (searchParams === undefined) {
        params = {};
    }
    else {
        params = searchParams;
    }

    // pull out updatedAt
    const updatedAtJson = params.updatedAt;
    if (Array.isArray(updatedAtJson)) {
        throw new Error("updatedAt must be a json string");
    }
    const updatedAtParsed = updatedAtJson ? JSON.parse(updatedAtJson) : undefined;
    const { data: updatedAt, error: updatedAtError } = UpdatedAt.optional().safeParse(updatedAtParsed);
    if (updatedAtError) {
        throw new Error("updatedAt must be a valid date range");
    }

    // pull out search
    const search = params.search;
    if (Array.isArray(search)) {
        throw new Error("search must be a string");
    }

    // pull out number
    const number = params.number;
    if (Array.isArray(number)) {
        throw new Error("number must be a string");
    }

    // pull out priority
    const { data: priority, error: priorityError } = z.custom<Priority>().optional().safeParse(params.priority);
    if (priorityError) {
        throw new Error("priority must be a valid priority");
    }

    // pull out steps
    const { data: steps, error: stepsError } = z.union([z.string(), z.array(z.string())]).optional().safeParse(params.step);
    if (stepsError) {
        throw new Error("steps must be a string or an array of strings");
    }

    // pull out route-status
    const { data: routeStatus, error: routeStatusError } = z.union([z.nativeEnum(RouteState), z.array(z.nativeEnum(RouteState))]).optional().safeParse(params['route-status']);
    if (routeStatusError) {
        throw new Error("routeStatus must be a valid route status");
    }

    const { data: sortBy, error: sortByError } = z.enum(sortKeys).optional().safeParse(params.sort_by);
    if (sortByError) {
        throw new Error(`sortBy must be one of ${sortKeys.join(', ')}`);
    }

    // get sort_order
    const { data: sortOrder, error: sortOrderError } = z.enum(['asc', 'desc']).optional().safeParse(params.sort_order);
    if (sortOrderError) {
        throw new Error("sortOrder must be either 'asc' or 'desc'");
    }

    // pull out link
    const linkJson = params.link;
    if (Array.isArray(linkJson)) {
        throw new Error("link must be a json string");
    }
    const linkParsed = linkJson ? JSON.parse(linkJson) : undefined;
    const { data: link, error: linkError } = LinkFilter.optional().safeParse(linkParsed);
    if (linkError) {
        throw new Error("link must be a valid link filter object");
    }

    // pull out custom-field
    const customFieldJson = params['custom-field'];
    if (Array.isArray(customFieldJson)) {
        throw new Error("custom-field must be a json string");
    }
    const customFieldParsed = customFieldJson ? JSON.parse(customFieldJson) : undefined;
    const { data: customField, error: customFieldError } = CustomFieldFilter.optional().safeParse(customFieldParsed);
    if (customFieldError) {
        throw new Error("custom-field must be a valid custom field filter object");
    }

    // pull out showCompleted
    const showCompleted = params.showCompleted === 'true';

    return { updatedAt, search, number, priority, steps, routeStatus, sortBy, sortOrder, link, customField, showCompleted };
}

export const convertSearchParams = (
    searchParams: ReadonlyURLSearchParams
): NextServerSearchParams => (
    Array.from(searchParams.keys()).reduce<NextServerSearchParams>((acc, key) => {
        const value = searchParams.getAll(key);
        if (value.length === 1) {
            acc[key] = value[0];
        } else {
            acc[key] = value;
        }
        return acc;
    }, {})
)