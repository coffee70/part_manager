import { ReadonlyURLSearchParams } from "next/navigation"
import { z } from "zod"
import { NextServerSearchParams, Priority, SectionCollection, sortKeys } from "@/types/collections"

const UpdatedAt = z.object({
    to: z.coerce.date().optional(),
    from: z.coerce.date().optional(),
});

export type SearchParams = NextServerSearchParams | ReadonlyURLSearchParams

export const getSearchParams = (searchParams: SearchParams, collection: SectionCollection) => {
    // convert client side ReadOnlySearchParams to server side type
    let params: NextServerSearchParams;
    if (searchParams instanceof ReadonlyURLSearchParams) {
        params = convertSearchParams(searchParams)
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

    // pull out priority
    const { data: priority, error: priorityError } = z.custom<Priority>().optional().safeParse(params.priority);
    if (priorityError) {
        throw new Error("priority must be a valid priority");
    }

    const { data: sortBy, error: sortByError } = z.enum(sortKeys[collection]).optional().safeParse(params.sort_by);
    if (sortByError) {
        throw new Error(`sortBy must be one of ${sortKeys[collection].join(', ')}`);
    }

    // get sort_order
    const { data: sortOrder, error: sortOrderError } = z.enum(['asc', 'desc']).optional().safeParse(params.sort_order);
    if (sortOrderError) {
        throw new Error("sortOrder must be either 'asc' or 'desc'");
    }

    return { updatedAt, search, priority, sortBy, sortOrder };
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