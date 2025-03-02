import Routers from "@/components/routers/routers";
import { routerKeys } from "@/lib/query_keys";
import { getRouters } from "@/server/routers/get_routers";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: routerKeys.all(),
        queryFn: () => getRouters(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Routers />
        </HydrationBoundary>
    )
}