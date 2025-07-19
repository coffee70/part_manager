import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/components/instances/table_container";
import { instanceKeys, sectionKeys, contextKeys, routeKeys, tableConfigurationKeys } from "@/lib/query_keys";
import { getInstances } from "@/server/instances/get_instances";
import { getSections } from "@/server/sections/get_sections";
import { getContext } from "@/server/contexts/get_context";
import { getCurrentSteps } from "@/server/routes/get_current_steps";
import { getFieldsByContextId } from "@/server/fields/get_fields_by_context_id";
import { getTableConfiguration } from "@/server/configuration/get_table_configuration";
import { getContexts } from "@/server/contexts/get_contexts";

export default async function Page({
    params,
    searchParams
}: {
    params: { modelId: string };
    searchParams: NextServerSearchParams;
}) {
    const id = params.modelId
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: contextKeys.id("models", id),
        queryFn: () => getContext({ context: "models", id }),
    })

    await queryClient.prefetchQuery({
        queryKey: instanceKeys.all("models", id),
        queryFn: () => getInstances({ id, context: "models", searchParams }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("models", id),
        queryFn: () => getSections({
            context: "models",
            id
        }),
    })

    // current steps for filtering and sorting
    await queryClient.prefetchQuery({
        queryKey: routeKeys.currentSteps(id),
        queryFn: () => getCurrentSteps({ modelId: id }),
    })

    // table configuration
    await queryClient.prefetchQuery({
        queryKey: tableConfigurationKeys.configuration("models", id),
        queryFn: () => getTableConfiguration({ context: "models", contextId: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: tableConfigurationKeys.fieldsByContext("models", id),
        queryFn: () => getFieldsByContextId({ context: "models", contextId: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: tableConfigurationKeys.contexts("models"),
        queryFn: () => getContexts({ context: "models" }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}