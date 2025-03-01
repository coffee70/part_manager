import { Logo } from "@/components/ui/logo";
import { router } from "@/lib/url";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { redirect } from "next/navigation";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>

export default async function Layout({ children }: Props) {

  const { user } = await getCurrentSession();
  if (user) {
    redirect(router().base());
  }

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="w-full bg-foreground p-4">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </main>
  )
}
