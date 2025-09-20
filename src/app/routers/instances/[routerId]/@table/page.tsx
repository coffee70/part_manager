import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/components/instances/table_container";
import { instanceKeys, sectionKeys, contextKeys, tableConfigurationKeys, userKeys } from "@/lib/query_keys";
import { getInstances } from "@/server/instances/get_instances";
import { getSections } from "@/server/sections/get_sections";
import { getContext } from "@/server/contexts/get_context";
import { getTableConfiguration } from "@/server/configuration/get_table_configuration";
import { getFieldsByContextId } from "@/server/fields/get_fields_by_context_id";
import { getContexts } from "@/server/contexts/get_contexts";
import { getCurrentUser } from "@/server/auth/get_current_user";
import { getAppearance } from "@/server/auth/get_appearance";

export default async function Page({
    params,
    searchParams
}: {
    params: { routerId: string };
    searchParams: NextServerSearchParams;
}) {
    const routerId = params.routerId
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: contextKeys.id("routers", routerId),
        queryFn: () => getContext({ context: "routers", id: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: instanceKeys.all("routers", routerId, searchParams),
        queryFn: () => getInstances({ id: routerId, context: "routers", searchParams }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("routers", routerId),
        queryFn: () => getSections({
            context: "routers",
            id: routerId
        }),
    })

    // current user
    await queryClient.prefetchQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    // appearance
    await queryClient.prefetchQuery({
        queryKey: userKeys.appearance(),
        queryFn: () => getAppearance(),
    })

    // table configuration
    await queryClient.prefetchQuery({
        queryKey: tableConfigurationKeys.configuration("routers", routerId),
        queryFn: () => getTableConfiguration({ context: "routers", contextId: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: tableConfigurationKeys.fieldsByContext("routers", routerId),
        queryFn: () => getFieldsByContextId({ context: "routers", contextId: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: tableConfigurationKeys.contexts("routers"),
        queryFn: () => getContexts({ context: "routers" }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
} 