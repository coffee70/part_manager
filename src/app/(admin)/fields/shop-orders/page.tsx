import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";
import { sectionKeys } from "@/lib/query_keys";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all('shopOrders'),
        queryFn: () => getSections({ collection: 'shopOrders' }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Sections />
        </HydrationBoundary>
    )
}