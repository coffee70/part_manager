import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/app/(user)/serials/_containers/table_container";
import { getSerials } from "@/server/serials/get_serials";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams;
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.all('serials'),
        queryFn: () => getSerials({ searchParams }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}

