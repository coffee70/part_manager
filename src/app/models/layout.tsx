import PrimaryNavigation from "@/components/navigations/primary_navigation/primary_navigation";
import ModelNavigation from "@/components/navigations/secondary_navigation/model_navigation";
import ModelNavigationProvider from "@/components/navigations/secondary_navigation/model_navigation_provider";
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
            <ModelNavigationProvider>
                <ModelNavigation />
            </ModelNavigationProvider>
            {children}
        </main>
    )
}