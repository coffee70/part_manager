"use client"
import { userKeys } from "@/lib/query_keys";
import { getAppearance } from "@/server/auth/get_appearance";
import { Appearance, ClientAppearance, defaultAppearance } from "@/types/collections";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function isSystemDarkMode(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function listenForSystemDarkModeChange(callback: (isDark: boolean) => void) {
    if (typeof window === "undefined") return () => {};
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial state
    callback(mediaQuery.matches);

    // Listener for changes
    const listener = (event: MediaQueryListEvent) => {
        callback(event.matches);
    };

    mediaQuery.addEventListener("change", listener);

    // Cleanup function
    return () => mediaQuery.removeEventListener("change", listener);
}

function appearanceToClientAppearance(appearance: Appearance): ClientAppearance {
    switch (appearance.theme) {
        case 'system':
            return {
                theme: isSystemDarkMode() ? 'dark' : 'light',
            }
        default:
            return {
                theme: appearance.theme,
            }
    }
}

export function useAppearance() {
    const { data: appearance = defaultAppearance } = useQuery({
        queryKey: userKeys.appearance(),
        queryFn: () => getAppearance(),
    })

    const [clientAppearance, setClientAppearance] = React.useState<ClientAppearance>(appearanceToClientAppearance(appearance));

    // Recompute client appearance whenever the server/user appearance changes
    React.useEffect(() => {
        setClientAppearance(appearanceToClientAppearance(appearance));
    }, [appearance]);

    // Only listen to system theme changes when the user selected 'system'
    React.useEffect(() => {
        if (appearance.theme !== 'system') return;
        return listenForSystemDarkModeChange((isDark) => {
            setClientAppearance((prev) => ({ ...prev, theme: isDark ? 'dark' : 'light' }));
        });
    }, [appearance.theme]);

    return clientAppearance;
}