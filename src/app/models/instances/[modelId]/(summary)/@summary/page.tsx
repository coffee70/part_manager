import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { attachmentKeys, commentKeys, instanceKeys, linkKeys, sectionKeys, contextKeys, routeKeys } from "@/lib/query_keys";
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
import { getRoute } from "@/server/routes/get_route";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { hasRoute } from "@/server/routes/has_route";
import { getTargetSteps } from "@/server/routes/get_target_steps";
import { getContexts } from "@/server/contexts/get_contexts";

export default async function Page({
    params,
    searchParams
}: {
    params: { modelId: string };
    searchParams: NextServerSearchParams;
}) {
    const id = params.modelId
    const instanceId = searchParams.id

    const instances = await getInstances({ id, context: "models", searchParams })

    // Combine the logic for missing/invalid instanceId and not found in instances
    const invalidInstanceId = !instanceId || Array.isArray(instanceId) || !instances.find((instance) => instance._id === instanceId);

    if (invalidInstanceId) {
        if (instances.length === 0) {
            return <SummaryError />;
        }
        const redirectUrl = router().models().instances().instance(id, instances[0]._id);
        redirect(redirectUrl);
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: contextKeys.id("models", id),
        queryFn: () => getContext({ context: "models", id }),
    })

    await queryClient.prefetchQuery({
        queryKey: instanceKeys.id("models", id, instanceId),
        queryFn: () => getInstance({ id, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("models", id),
        queryFn: () => getSections({
            context: "models",
            id
        }),
    })

    // prefetch comments
    await queryClient.prefetchQuery({
        queryKey: commentKeys.all("models", id, instanceId),
        queryFn: () => getComments({ context: "models", id, instanceId }),
    })

    // prefetch links
    await queryClient.prefetchQuery({
        queryKey: linkKeys.all("models", id, instanceId),
        queryFn: () => getLinks({ context: "models", id, instanceId }),
    })

    // prefetch attachments
    await queryClient.prefetchQuery({
        queryKey: attachmentKeys.all("models", id, instanceId),
        queryFn: () => getAttachments({ context: "models", id, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.attachable("models", id),
        queryFn: () => isAttachable({ context: "models", id }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.linkable("models", id),
        queryFn: () => isLinkable({ context: "models", id }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.commentable("models", id),
        queryFn: () => isCommentable({ context: "models", id }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.hasPriority("models", id),
        queryFn: () => hasPriority({ context: "models", id }),
    })

    // routes
    await queryClient.prefetchQuery({
        queryKey: routeKeys.id(id, instanceId),
        queryFn: () => getRoute({ modelId: id, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: routeKeys.hasRoute(id, instanceId),
        queryFn: () => hasRoute({ modelId: id, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: routeKeys.currentStep(id, instanceId),
        queryFn: () => getCurrentStep({ modelId: id, instanceId }),
    })

    await queryClient.prefetchQuery({
        queryKey: routeKeys.targetSteps(id, instanceId),
        queryFn: () => getTargetSteps({ modelId: id, instanceId }),
    })

    // route cloning
    await queryClient.prefetchQuery({
        queryKey: contextKeys.all("models"),
        queryFn: () => getContexts({ context: "models" }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SummaryContainer />
        </HydrationBoundary>
    )
}