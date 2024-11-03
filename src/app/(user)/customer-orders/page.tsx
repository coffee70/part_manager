import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CustomerOrders from "@/components/customer-orders/customer_orders";
import { collectionKeys, commentKeys, sectionKeys } from "@/lib/query_keys";
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import { getCustomerOrders } from "@/server/customer_orders/get_customer_orders";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";

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

    const id = searchParams.id
    if (Array.isArray(id)) {
        throw new Error('Multiple IDs are not supported. URL is malformed.')
    }

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.id('customerOrders', id),
        queryFn: () => getCustomerOrder({ _id: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all('customerOrders'),
        queryFn: () => getSections({ collection: 'customerOrders' }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all('customerOrders', id),
        queryFn: () => getComments({ collection: 'customerOrders', id }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerOrders />
        </HydrationBoundary>
    )
}

