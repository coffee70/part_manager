import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys, commentKeys, linkKeys, sectionKeys } from "@/lib/query_keys";
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import SummaryContainer from "@/app/(user)/customer-orders/_containers/summary_container";
import { getLinks } from "@/server/links/get_links";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams;
}) {
    const queryClient = new QueryClient();

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

    // prefetch links
    await queryClient.prefetchQuery({
        queryKey: linkKeys.all('customerOrders', id),
        queryFn: () => getLinks({ modelId: id, model: 'customerOrders' }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}

