import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "../globals.css";
import { cn } from "@/lib/utils"

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
          "h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
