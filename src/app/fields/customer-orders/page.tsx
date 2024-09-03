import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Fields from "./sections";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['fields', 'customerOrders'],
        queryFn: () => getSections('CUSTOMER_ORDER')
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Fields />
        </HydrationBoundary>
    )
}