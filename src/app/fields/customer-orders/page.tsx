import { getFields } from "@/server/fields/get_fields";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Fields from "./fields";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['fields', 'customerOrders'],
        queryFn: () => getFields('CUSTOMER_ORDER')
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Fields />
        </HydrationBoundary>
    )
}