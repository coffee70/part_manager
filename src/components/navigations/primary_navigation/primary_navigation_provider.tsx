import { userKeys } from "@/lib/query_keys";
import { getCurrentUser } from "@/server/auth/get_current_user";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode;
}

export default async function PrimaryNavigationProvider({ children }: Props) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    )
}