import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { attachmentKeys, commentKeys, instanceKeys, linkKeys, sectionKeys, contextKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { getComments } from "@/server/comments/get_comments";
import { NextServerSearchParams } from "@/types/collections";
import { getLinks } from "@/server/links/get_links";
import { getInstance } from "@/server/instances/get_instance";
import SummaryContainer from "@/components/instances/summary_container";
import { redirect } from "next/navigation";
import { getInstances } from "@/server/instances/get_instances";
import { router } from "@/lib/url";
import SummaryError from "@/components/summary/summary_error";
import { getAttachments } from "@/server/attachments/get_attachments";
import { isAttachable } from "@/server/contexts/is_attachable";
import { isLinkable } from "@/server/contexts/is_linkable";
import { isCommentable } from "@/server/contexts/is_commentable";
import { hasPriority } from "@/server/contexts/has_priority";
import { getContext } from "@/server/contexts/get_context";

export default async function Page({
    params,
    searchParams
}: {
    params: { routerId: string };
    searchParams: NextServerSearchParams;
}) {
    const routerId = params.routerId
    const instanceId = searchParams.id
    if (!instanceId || Array.isArray(instanceId)) {
        const instances = await getInstances({ id: routerId, searchParams })
        if (instances.length === 0) return <SummaryError />
        redirect(router().routers().instances().instance(routerId, instances[0]._id));
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: contextKeys.id("routers", routerId),
        queryFn: () => getContext({ context: "routers", id: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: instanceKeys.id("routers", routerId, instanceId),
        queryFn: () => getInstance({ id: routerId, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("routers", routerId),
        queryFn: () => getSections({
            context: "routers",
            id: routerId
        }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all("routers", routerId, instanceId),
        queryFn: () => getComments({ context: "routers", id: routerId, instanceId }),
    })

    // prefetch links
    await queryClient.prefetchQuery({
        queryKey: linkKeys.all("routers", routerId, instanceId),
        queryFn: () => getLinks({ context: "routers", id: routerId, instanceId }),
    })

    // prefetch attachments
    await queryClient.prefetchQuery({
        queryKey: attachmentKeys.all("routers", routerId, instanceId),
        queryFn: () => getAttachments({ context: "routers", id: routerId, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.attachable("routers", routerId),
        queryFn: () => isAttachable({ context: "routers", id: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.linkable("routers", routerId),
        queryFn: () => isLinkable({ context: "routers", id: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.commentable("routers", routerId),
        queryFn: () => isCommentable({ context: "routers", id: routerId }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.hasPriority("routers", routerId),
        queryFn: () => hasPriority({ context: "routers", id: routerId }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
} 