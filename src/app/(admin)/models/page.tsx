import Models from "@/components/models/models";
import { modelKeys } from "@/lib/query_keys";
import { getModels } from "@/server/models/get_models";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Models />
        </HydrationBoundary>
    )
}