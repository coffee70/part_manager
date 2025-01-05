import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";
import { modelKeys, sectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import { getModels } from "@/server/models/get_models";
import { redirect } from "next/navigation";
import { getModel } from "@/server/models/get_model";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams
}) {
    const modelId = searchParams.modelId;
    if (!modelId || Array.isArray(modelId)) {
        const models = await getModels();
        redirect(`/fields?modelId=${models[0]._id}`);
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

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Sections />
        </HydrationBoundary>
    )
}