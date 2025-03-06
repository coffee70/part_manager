import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/components/instances/table_container";
import { instanceKeys, routerKeys, sectionKeys, contextKeys } from "@/lib/query_keys";
import { getInstances } from "@/server/instances/get_instances";
import { getRouter } from "@/server/routers/get_router";
import { getSections } from "@/server/sections/get_sections";
import { getContext } from "@/server/contexts/get_context";

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
        queryKey: instanceKeys.all("routers", routerId),
        queryFn: () => getInstances({ id: routerId, searchParams }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("routers", routerId),
        queryFn: () => getSections({
            context: "routers",
            id: routerId
        }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
} 