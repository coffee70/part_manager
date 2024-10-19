import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>

export default function Layout({ children }: Props) {
  return (
    <main className="flex h-screen">
      {children}
    </main>
  )
}
