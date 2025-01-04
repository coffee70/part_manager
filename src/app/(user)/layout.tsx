import React from "react";
import { redirect } from "next/navigation";
import SideNavigation from "@/components/navigations/side_nav/side_nav";
import { getCurrentSession } from "@/server/auth/get_current_session";
import SideNavigationProvider from "@/components/navigations/side_nav/side_nav_provider";

type Props = Readonly<{
  children: React.ReactNode;
}>

export default async function Layout({ children }: Props) {

  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex h-screen">
      <SideNavigationProvider>
        <SideNavigation />
      </SideNavigationProvider>
      {children}
    </main>
  )
}
