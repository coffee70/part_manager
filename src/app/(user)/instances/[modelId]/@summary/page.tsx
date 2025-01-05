import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { commentKeys, instanceKeys, linkKeys, sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import { getLinks } from "@/server/links/get_links";
import { getInstance } from "@/server/instances/get_instance";
import SummaryContainer from "@/components/instances/summary_container";
import { redirect } from "next/navigation";
import { getInstances } from "@/server/instances/get_instances";
import { instanceURL } from "@/lib/url";
import SummaryError from "@/components/summary/summary_error";

export default async function Page({
    params,
    searchParams
}: {
    params: { modelId: string };
    searchParams: NextServerSearchParams;
}) {
    const modelId = params.modelId
    const instanceId = searchParams.id
    if (!instanceId || Array.isArray(instanceId)) {
        const instances = await getInstances({ modelId, searchParams })
        if (instances.length === 0) return <SummaryError />
        redirect(instanceURL(modelId, instances[0]._id));
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: instanceKeys.id(modelId, instanceId),
        queryFn: () => getInstance({ modelId, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all(modelId),
        queryFn: () => getSections({ modelId }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all(modelId, instanceId),
        queryFn: () => getComments({ modelId, instanceId }),
    })

    // prefetch links
    await queryClient.prefetchQuery({
        queryKey: linkKeys.all(modelId, instanceId),
        queryFn: () => getLinks({ modelId, instanceId }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}