import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCustomerOrder, getCustomerOrders } from "./fetch";
import CustomerOrders from "./customer_orders";

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

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerOrders />
        </HydrationBoundary>
    )
}

