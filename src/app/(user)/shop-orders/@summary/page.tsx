import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys, commentKeys, linkKeys, sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import SummaryContainer from "@/app/(user)/shop-orders/_containers/summary_container";
import { getShopOrder } from "@/server/shop_orders/get_shop_order";
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
        queryKey: collectionKeys.id('shopOrders', id),
        queryFn: () => getShopOrder({ _id: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all('shopOrders'),
        queryFn: () => getSections({ collection: 'shopOrders' }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all('shopOrders', id),
        queryFn: () => getComments({ collection: 'shopOrders', id }),
    })

    // prefetch links
    await queryClient.prefetchQuery({
        queryKey: linkKeys.all('shopOrders', id),
        queryFn: () => getLinks({ modelId: id, model: 'shopOrders' }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}

