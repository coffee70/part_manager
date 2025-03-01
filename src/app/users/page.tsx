import Users from "@/components/users/users";
import { userKeys } from "@/lib/query_keys";
import { getUsers } from "@/server/users/get_users";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: userKeys.all(),
        queryFn: () => getUsers(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Users />
        </HydrationBoundary>
    )
}