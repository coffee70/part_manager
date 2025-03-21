import { modelKeys, userKeys } from "@/lib/query_keys";
import { getCurrentUser } from "@/server/auth/get_current_user";
import { getModels } from "@/server/models/get_models";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode;
}

export default async function SideNavigationProvider({ children }: Props) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    await queryClient.prefetchQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    )
}