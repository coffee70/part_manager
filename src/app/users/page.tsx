import Users from "@/components/users/users";
import { AppBar } from "@/components/ui/app_bar";
import { PageTitle } from "@/components/ui/page_title";
import { UsersIcon } from "lucide-react";
import { userKeys } from "@/lib/query_keys";
import { getUsers } from "@/server/users/get_users";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CreateUser from "@/components/users/create_user";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: userKeys.all,
        queryFn: getUsers,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col w-full h-full">
                <AppBar>
                    <PageTitle
                        Icon={UsersIcon}
                        title="Users"
                    />
                    <CreateUser />
                </AppBar>
                <Users />
            </div>
        </HydrationBoundary>
    )
}