import TableContainer from "@/components/routes/table/table_container"
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function Page({
    params
}: {
    params: { modelId: string, instanceId: string }
}) {
    const { modelId, instanceId } = params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId })
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}