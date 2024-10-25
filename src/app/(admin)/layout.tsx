import React from "react";
import { redirect } from "next/navigation";
import SideNavigation from "@/components/navigations/side_nav/side_nav";
import { getCurrentSession } from "@/server/auth/get_current_session";

type Props = Readonly<{
    children: React.ReactNode;
}>

export default async function Layout({ children }: Props) {

    const { user } = await getCurrentSession();
    if (!user || user.role !== "admin") {
        redirect("/login");
    }

    return (
        <main className="flex h-screen">
            <SideNavigation />
            {children}
        </main>
    )
}