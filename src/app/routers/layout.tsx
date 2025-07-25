import PrimaryNavigation from "@/components/navigations/primary_navigation/primary_navigation";
import RouterNavigation from "@/components/navigations/secondary_navigation/router_navigation";
import RouterNavigationProvider from "@/components/navigations/secondary_navigation/router_navigation_provider";
import { router } from "@/lib/url";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { redirect } from "next/navigation";

export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {
    const { user } = await getCurrentSession();
    if (!user) {
        redirect(router().auth().login());
    }

    return (
        <main className="flex h-screen w-full">
            <PrimaryNavigation role={user.role} />
            <RouterNavigationProvider>
                <RouterNavigation />
            </RouterNavigationProvider>
            {children}
        </main>
    )
}