import Header from "@/components/routes/header/header";
import { instanceKeys } from "@/lib/query_keys";
import { getInstance } from "@/server/instances/get_instance";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page({
    params
}: {
    params: { modelId: string, instanceId: string }
}) {
    const { modelId, instanceId } = params;

    const queryClient = new QueryClient();
    
    await queryClient.prefetchQuery({
        queryKey: instanceKeys.id("models", modelId, instanceId),
        queryFn: () => getInstance({ id: modelId, instanceId })
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
        </HydrationBoundary>
    )
}