import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";
import { modelKeys, sectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import { getModels } from "@/server/models/get_models";
import { redirect } from "next/navigation";
import { getModel } from "@/server/models/get_model";
import SectionError from "@/components/fields/section_error";
import { router } from "@/lib/url";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams
}) {
    const modelId = searchParams.modelId;
    if (!modelId || Array.isArray(modelId)) {
        const models = await getModels();
        if (models.length === 0) return <SectionError />;
        redirect(router().models().admin().fields().model(models[0]._id));
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all(modelId),
        queryFn: () => getSections({ modelId }),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Sections />
        </HydrationBoundary>
    )
}