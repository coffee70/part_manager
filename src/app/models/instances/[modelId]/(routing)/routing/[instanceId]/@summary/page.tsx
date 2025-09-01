import { routeKeys } from "@/lib/query_keys";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getRouteFieldValues } from "@/server/routes/get_route_field_values";
import SummaryContainer from "@/components/routes/summary/summary_container";
import { NextServerSearchParams } from "@/types/collections";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { redirect } from "next/navigation";
import { router } from "@/lib/url";
import { RouteState } from "@/types/collections";
import RouteNotStarted from "@/components/routes/summary/route_not_started";
import RouteCompleted from "@/components/routes/summary/route_completed";
import GenericError from "@/components/errors/generic_error";
import { getRoute } from "@/server/routes/get_route";

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
    // Extract route parameters
    const { modelId, instanceId } = params;
    const rawStepId = searchParams.stepId;

    // Case 1: Route is stopped - Show not started view
    if (rawStepId === RouteState.Stopped) {
        return <RouteNotStarted />
    }
    
    // Case 2: Route is completed - Show completion view
    if (rawStepId === RouteState.Completed) {
        return <RouteCompleted />
    }
    
    // Case 3: No step ID - Redirect to current step
    if (!rawStepId) {
        const currentStepQuery = await getCurrentStep({ modelId, instanceId });
        
        // Handle error case if we can't find current step
        if (!currentStepQuery || !currentStepQuery.id) {
            return <GenericError />
        }
        
        // Redirect to the current step
        redirect(router().models().instances().step(modelId, instanceId, currentStepQuery.id));
    }
    
    // Case 4: Normal step ID - Normalize if it's an array
    const stepId = Array.isArray(rawStepId) ? rawStepId[0] : rawStepId;

    // check to see if step id is in the route nodes of the instance
    const route = await getRoute({ modelId, instanceId });
    if (!route) {
        return <GenericError />
    }
    if (!route.nodes.some(node => node.id === stepId)) {
        return <GenericError />
    }
    
    // Initialize query client and prefetch data
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: routeKeys.routeFieldValues(modelId, instanceId, stepId),
        queryFn: () => getRouteFieldValues({ stepId, modelId, modelInstanceId: instanceId })
    })

    // prefetch the route for the title
    await queryClient.prefetchQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId })
    })

    // Render summary component with hydrated data
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}