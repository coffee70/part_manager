import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/components/instances/table_container";
import { instanceKeys, sectionKeys, contextKeys, routeKeys } from "@/lib/query_keys";
import { getInstances } from "@/server/instances/get_instances";
import { getSections } from "@/server/sections/get_sections";
import { getContext } from "@/server/contexts/get_context";
import { isStarted } from "@/server/routes/is_started";

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
        queryFn: () => getInstances({ id, searchParams }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("models", id),
        queryFn: () => getSections({
            context: "models",
            id
        }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}