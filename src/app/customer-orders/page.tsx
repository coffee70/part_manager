import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import { getCustomerOrders } from "@/server/customer_orders/get_customer_orders";
import CustomerOrders from "@/components/customer-orders/customer_orders";
import { collectionKeys } from "@/lib/query_keys";

export default async function Page({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.all('customerOrders'),
        queryFn: () => getCustomerOrders({ searchParams }),
    })

    const id = searchParams.id
    if (Array.isArray(id)) {
        throw new Error('Multiple IDs are not supported. URL is malformed.')
    }

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.id('customerOrders', id),
        queryFn: () => getCustomerOrder({ _id: id }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerOrders />
        </HydrationBoundary>
    )
}

