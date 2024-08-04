import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/app/providers";
import SideNavigation from "@/components/navigations/side_nav/main";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Aentx Manager",
  description: "Aentx Manager is a web application that helps you manage your manufacturing pipelin.",
};

type Props = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({ children }: Props) {
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
        </ReactQueryProvider>
      </body>
    </html>
  );
}
