import Routes from "@/components/routes/routes";
import { modelKeys } from "@/lib/query_keys";
import { routeURL } from "@/lib/url";
import { getModel } from "@/server/models/get_model";
import { getModels } from "@/server/models/get_models";
import { NextServerSearchParams } from "@/types/collections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams
}) {
    const modelId = searchParams.modelId;
    if (!modelId || Array.isArray(modelId)) {
        const models = await getModels();
        if (models.length === 0) return;
        redirect(routeURL(models[0]._id));
    }

    const queryClient = new QueryClient();

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
            <Routes />
        </HydrationBoundary>
    )
}