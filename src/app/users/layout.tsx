import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { router } from "@/lib/url";
import PrimaryNavigation from "@/components/navigations/primary_navigation/primary_navigation";
import PrimaryNavigationProvider from "@/components/navigations/primary_navigation/primary_navigation_provider";

type Props = Readonly<{
    children: React.ReactNode;
}>

export default async function Layout({ children }: Props) {

    const { user } = await getCurrentSession();
    if (!user || user.role !== "admin") {
        redirect(router().auth().login());
    }

    return (
        <main className="flex h-screen w-full">
            <PrimaryNavigationProvider>
                <PrimaryNavigation role={user.role} />
            </PrimaryNavigationProvider>
            {children}
        </main>
    )
}