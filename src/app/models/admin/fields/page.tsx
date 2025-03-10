import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";
import { contextKeys, sectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import { getModels } from "@/server/models/get_models";
import { redirect } from "next/navigation";
import SectionError from "@/components/fields/section_error";
import { router } from "@/lib/url";
import { getContext } from "@/server/contexts/get_context";
import { getContexts } from "@/server/contexts/get_contexts";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams
}) {
    const modelId = searchParams.id;
    if (!modelId || Array.isArray(modelId)) {
        const models = await getModels();
        if (models.length === 0) return <SectionError />;
        redirect(router().models().admin().fields().model(models[0]._id));
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("models", modelId),
        queryFn: () => getSections({
            context: "models",
            id: modelId
        }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.id("models", modelId),
        queryFn: () => getContext({
            context: "models",
            id: modelId
        }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.all("models"),
        queryFn: () => getContexts({
            context: "models"
        }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Sections />
        </HydrationBoundary>
    )
}