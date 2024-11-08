import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys, commentKeys, sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import SummaryContainer from "@/app/(user)/serials/_containers/summary_container";
import { getSerial } from "@/server/serials/get_serial";

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
        queryKey: collectionKeys.id('serials', id),
        queryFn: () => getSerial({ _id: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all('serials'),
        queryFn: () => getSections({ collection: 'serials' }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all('serials', id),
        queryFn: () => getComments({ collection: 'serials', id }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}

