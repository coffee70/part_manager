import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";
import { contextKeys, sectionKeys } from "@/lib/query_keys";
import { NextServerSearchParams } from "@/types/collections";
import { redirect } from "next/navigation";
import SectionError from "@/components/fields/section_error";
import { router } from "@/lib/url";
import { getRouters } from "@/server/routers/get_routers";
import { getContext } from "@/server/contexts/get_context";
import { getContexts } from "@/server/contexts/get_contexts";

export default async function Page({
    searchParams
}: {
    searchParams: NextServerSearchParams
}) {
    const routerId = searchParams.id;
    if (!routerId || Array.isArray(routerId)) {
        const routers = await getRouters();
        if (routers.length === 0) return <SectionError />;
        redirect(router().routers().admin().fields().router(routers[0]._id));
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: sectionKeys.all("routers", routerId),
        queryFn: () => getSections({
            context: "routers",
            id: routerId
        }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.id("routers", routerId),
        queryFn: () => getContext({
            context: "routers",
            id: routerId
        }),
    })

    await queryClient.prefetchQuery({
        queryKey: contextKeys.all("routers"),
        queryFn: () => getContexts({
            context: "routers"
        }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Sections />
        </HydrationBoundary>
    )
}