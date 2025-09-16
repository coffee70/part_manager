import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/app/providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeApplier from "@/components/appearance/theme_applier";
import { getCurrentSession } from "@/server/auth/get_current_session";

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

export default async function Layout({ children }: Props) {
  const { user } = await getCurrentSession();
  const themePref = user?.appearance?.theme ?? 'light';
  const htmlClassName = themePref === 'dark' ? 'dark' : undefined;

  return (
    <html lang="en" data-theme={themePref} className={htmlClassName}>
      <body
        className={cn(
          "flex min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;var t=d.dataset.theme;var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'){d.classList.add('dark');d.style.colorScheme='dark';}else if(t==='light'){d.classList.remove('dark');d.style.colorScheme='light';}else if(t==='system'){if(m){d.classList.add('dark');d.style.colorScheme='dark';}else{d.classList.remove('dark');d.style.colorScheme='light';}}}catch(e){}})();",
          }}
        />
        <ReactQueryProvider>
          <ThemeApplier />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
