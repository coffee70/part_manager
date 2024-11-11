import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { collectionKeys, commentKeys, linkKeys, sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import SummaryContainer from "@/app/(user)/customers/_containers/summary_container";
import { getLinks } from "@/server/links/get_links";
import { getCustomer } from "@/server/customers/get_customer";

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
        queryKey: collectionKeys.id('customers', id),
        queryFn: () => getCustomer({ _id: id }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all('customers'),
        queryFn: () => getSections({ collection: 'customers' }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all('customers', id),
        queryFn: () => getComments({ collection: 'customers', id }),
    })

    // prefetch links
    await queryClient.prefetchQuery({
        queryKey: linkKeys.all('customers', id),
        queryFn: () => getLinks({ modelId: id, model: 'customers' }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}

