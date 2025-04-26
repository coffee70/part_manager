import { routeKeys } from "@/lib/query_keys";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getRouteFieldValues } from "@/server/routes/get_route_field_values";
import SummaryContainer from "@/components/routes/summary_container";
import { NextServerSearchParams } from "@/types/collections";

export default async function Page(
    {
        params,
        searchParams,
    }: {
        params: {
            modelId: string;
            instanceId: string;
        }
        searchParams: NextServerSearchParams
    }
) {
    const { modelId, instanceId } = params;
    const raw_stepId = searchParams.stepId;
    if (!raw_stepId) return <div>No step ID</div>;
    const stepId = Array.isArray(raw_stepId) ? raw_stepId[0] : raw_stepId;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: routeKeys.routeFieldValues(modelId, instanceId, stepId),
        queryFn: () => getRouteFieldValues({ stepId, modelId, modelInstanceId: instanceId })
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}