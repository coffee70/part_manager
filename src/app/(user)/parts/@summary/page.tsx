import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys, commentKeys, sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import SummaryContainer from "@/app/(user)/parts/_containers/summary_container";
import { getPart } from "@/server/parts/get_part";

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
        queryKey: collectionKeys.id('parts', id),
        queryFn: () => getPart({ _id: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all('parts'),
        queryFn: () => getSections({ collection: 'parts' }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all('parts', id),
        queryFn: () => getComments({ collection: 'parts', id }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}

