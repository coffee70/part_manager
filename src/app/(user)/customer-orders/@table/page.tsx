import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";
import { getCustomerOrders } from "@/server/customer_orders/get_customer_orders";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/app/(user)/customer-orders/_containers/table_container";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams;
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.all('customerOrders'),
        queryFn: () => getCustomerOrders({ searchParams }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}

