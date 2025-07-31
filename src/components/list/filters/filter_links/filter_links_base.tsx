'use client'
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { instanceKeys, contextKeys } from "@/lib/query_keys";
import { getContexts } from "@/server/contexts/get_contexts";
import { KVValue } from "@/types/collections";
import LinksKVField from "./links_kv_field";

export default function LinksFilterBase() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Fetch all contexts to get linkable ones
    const { data: contexts = [] } = useQuery({
        queryKey: contextKeys.all(context),
        queryFn: () => getContexts({ context }),
    });

    // Filter to only show linkable contexts
    const linkableContexts = contexts.filter(ctx => ctx.linkable);

    // Get context IDs for the keys (use IDs instead of names for uniqueness)
    const contextKeys_array = linkableContexts.map(ctx => ctx._id);

    // Create context colors map (keyed by context ID, but display names in UI)
    const contextColors = linkableContexts.reduce<Record<string, string>>((acc, ctx) => {
        acc[ctx._id] = ctx.color;
        return acc;
    }, {});

    // Create context ID to name mapping for display purposes
    const contextIdToName = linkableContexts.reduce<Record<string, string>>((acc, ctx) => {
        acc[ctx._id] = ctx.name;
        return acc;
    }, {});

    // Parse current URL parameter
    const linkParam = searchParams.get('link');
    const currentValue: KVValue = linkParam ? JSON.parse(linkParam) : {};

    // Handle value changes
    const handleValueChange = React.useCallback((value: KVValue) => {
        const params = new URLSearchParams(searchParams);
        const originalParamsString = params.toString();
        
        // Check if value has any non-empty entries
        const hasValues = Object.values(value).some(v => v && v.trim() !== '');
        
        if (hasValues) {
            params.set('link', JSON.stringify(value));
        } else {
            params.delete('link');
        }
        
        // Only update URL and invalidate queries if parameters actually changed
        const newParamsString = params.toString();
        if (originalParamsString !== newParamsString) {
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            replace(`${pathname}?${newParamsString}`);
        }
    }, [searchParams, queryClient, context, id, pathname, replace]);

    return (
        <div className="p-3 min-w-80">
            <LinksKVField
                field={{
                    keys: contextKeys_array,
                    multiple: true
                }}
                value={currentValue}
                setValue={handleValueChange}
                contextColors={contextColors}
                contextIdToName={contextIdToName}
            />
        </div>
    );
} 