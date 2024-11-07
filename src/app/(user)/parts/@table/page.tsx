import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import TableContainer from "@/app/(user)/parts/_containers/table_container";
import { getParts } from "@/server/parts/get_parts";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams;
}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: collectionKeys.all('parts'),
        queryFn: () => getParts({ searchParams }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TableContainer />
        </HydrationBoundary>
    )
}

