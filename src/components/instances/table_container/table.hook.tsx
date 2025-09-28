import { getTableConfiguration } from "@/server/configuration/get_table_configuration";
import { Column } from "./helpers";
import React from "react";
import { contextKeys, instanceKeys, tableConfigurationKeys } from "@/lib/query_keys";
import { useQuery } from "@tanstack/react-query";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { getFieldsByContextId } from "@/server/fields/get_fields_by_context_id";
import { getInstances } from "@/server/instances/get_instances";
import { clientToServerSearchParams } from "@/lib/search_params";
import { useSearchParams } from "next/navigation";
import { useServerTransitionContext } from "./server_transition.context";
import { hasPriority } from "@/server/contexts/has_priority";

export default function useTable() {
    const { context, id } = useInstanceURL();
    const readOnlySearchParams = useSearchParams();
    const searchParams = clientToServerSearchParams(readOnlySearchParams);
    const { isServerTransitionPending } = useServerTransitionContext();

    const { 
        data: tableConfiguration,
        isPending: isTableConfigurationPending,
    } = useQuery({
        queryKey: tableConfigurationKeys.configuration(context, id),
        queryFn: () => getTableConfiguration({ context, contextId: id }),
        enabled: !!context && !!id,
    })

    const { 
        data: fields = [],
        isPending: isFieldsPending,
    } = useQuery({
        queryKey: tableConfigurationKeys.fieldsByContext(context, id),
        queryFn: () => getFieldsByContextId({ context, contextId: id }),
        enabled: !!context && !!id,
    })

    const { 
        data: instances, 
        isError: isInstancesError, 
        isPending: isInstancesPending, 
        isFetching: isInstancesFetching 
    } = useQuery({
        queryKey: instanceKeys.all(context, id, searchParams),
        queryFn: () => getInstances({ id, context, searchParams }),
    })

    const { 
        data: priority,
        isPending: isPriorityPending,
     } = useQuery({
        queryKey: contextKeys.hasPriority(context, id),
        queryFn: () => hasPriority({ context, id }),
        enabled: !!context && !!id,
    })

    // Get combined and sorted columns
    const sortedColumns = React.useMemo(() => {
        if (!tableConfiguration) return [];

        const allColumns: Column[] = [
            ...tableConfiguration.systemColumns.map(col => ({ ...col, isSystem: true as const })),
            ...tableConfiguration.intrinsicFieldColumns.map(col => ({ ...col, isSystem: false as const }))
        ];

        return allColumns.sort((a, b) => a.order - b.order);
    }, [tableConfiguration]);

    const isTableLoading = React.useMemo(() => {
        return isTableConfigurationPending || isFieldsPending || isPriorityPending;
    }, [isTableConfigurationPending, isFieldsPending, isPriorityPending]);

    const isTableBodyLoading = React.useMemo(() => {
        return isTableLoading || isInstancesPending || isInstancesFetching || isServerTransitionPending;
    }, [isTableLoading, isInstancesPending, isInstancesFetching, isServerTransitionPending]);

    const isTableError = React.useMemo(() => {
        return isInstancesError;
    }, [isInstancesError]);

    return {
        hasPriority: priority,
        sortedColumns,
        fields,
        instances,
        isTableLoading,
        isTableBodyLoading,
        isTableError,
    }
}