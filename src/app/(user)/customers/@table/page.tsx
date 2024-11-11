import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/app/(user)/customers/_containers/table_container";
import { getCustomers } from "@/server/customers/get_customers";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams;
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.all('customers'),
        queryFn: () => getCustomers({ searchParams }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}

