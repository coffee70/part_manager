import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/app/ReactQueryProvider";
import Main from "./main";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          <Main>
            {children}
          </Main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
