import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/components/instances/table_container";
import { instanceKeys } from "@/lib/query_keys";
import { getInstances } from "@/server/instances/get_instances";

export default async function Page({
    params,
    searchParams
}: {
    params: { modelId: string };
    searchParams: NextServerSearchParams;
}) {
    const modelId = params.modelId
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: instanceKeys.all(modelId),
        queryFn: () => getInstances({ modelId, searchParams }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}