import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/components/instances/table_container";
import { instanceKeys, modelKeys, sectionKeys } from "@/lib/query_keys";
import { getInstances } from "@/server/instances/get_instances";
import { getModel } from "@/server/models/get_model";
import { getSections } from "@/server/sections/get_sections";

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

    await queryClient.prefetchQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all(modelId),
        queryFn: () => getSections({ modelId }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}