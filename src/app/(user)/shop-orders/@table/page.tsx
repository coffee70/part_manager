import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/app/(user)/shop-orders/_containers/table_container";
import { getShopOrders } from "@/server/shop_orders/get_shop_orders";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams;
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.all('shopOrders'),
        queryFn: () => getShopOrders({ searchParams }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}

