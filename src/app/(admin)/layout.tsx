import React from "react";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import SideNavigation from "@/components/navigations/side_nav/main";

type Props = Readonly<{
    children: React.ReactNode;
}>

export default async function Layout({ children }: Props) {

    const { user } = await validateRequest();
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