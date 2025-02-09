import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { attachmentKeys, commentKeys, instanceKeys, linkKeys, modelKeys, sectionKeys } from "@/lib/query_keys";
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
import { getAttachments } from "@/server/attachments/get_attachments";
import { getModels } from "@/server/models/get_models";
import { getModel } from "@/server/models/get_model";
import { isAttachable } from "@/server/models/is_attachable";
import { isLinkable } from "@/server/models/is_linkable";
import { isCommentable } from "@/server/models/is_commentable";
import { hasPriority } from "@/server/models/has_priority";

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

    // prefetch model
    await queryClient.prefetchQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
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

    // prefetch models for links
    await queryClient.prefetchQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    // prefetch attachments
    await queryClient.prefetchQuery({
        queryKey: attachmentKeys.all(modelId, instanceId),
        queryFn: () => getAttachments({ modelId, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.attachable(modelId),
        queryFn: () => isAttachable({ modelId }),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.linkable(modelId),
        queryFn: () => isLinkable({ modelId }),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.commentable(modelId),
        queryFn: () => isCommentable({ modelId }),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.hasPriority(modelId),
        queryFn: () => hasPriority({ modelId }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}