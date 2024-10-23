import Logo from "@/components/ui/logo";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>

export default function Layout({ children }: Props) {
  return (
    <main className="h-screen">
      <div className="flex w-full bg-foreground p-4">
        <Logo />
      </div>
      {children}
    </main>
  )
}
