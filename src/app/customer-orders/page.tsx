import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import { getCustomerOrders } from "@/server/customer_orders/get_customer_orders";
import { getParts } from "@/server/customer_orders/get_parts";
import CustomerOrders from "@/components/customer-orders/customer_orders";

export default async function Page({
    searchParams
} : {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['customerOrders', searchParams],
        queryFn: () => getCustomerOrders({ searchParams }),
    })

    await queryClient.prefetchQuery({
        queryKey: ['customerOrder', searchParams],
        queryFn: () => getCustomerOrder({ searchParams }),
    })

    await queryClient.prefetchQuery({
        queryKey: ['parts'],
        queryFn: getParts,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerOrders />
        </HydrationBoundary>
    )
}

