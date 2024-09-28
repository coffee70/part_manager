import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['sections', 'customerOrders'],
        queryFn: () => getSections({ collection: 'customerOrders' }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Sections />
        </HydrationBoundary>
    )
}