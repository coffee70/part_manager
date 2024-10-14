import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "../globals.css";
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/app/(manager)/providers";
import SideNavigation from "@/components/navigations/side_nav/main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Aentx Manager",
  description: "Aentx Manager is a web application that helps you manage your manufacturing pipeline.",
};

type Props = Readonly<{
  children: React.ReactNode;
}>

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReactQueryProvider>
          <main className="flex h-screen">
            <SideNavigation />
            {children}
          </main>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
