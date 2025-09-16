"use client"

import React from "react";
import { useAppearance } from "@/hooks/use_appearance.hook";

export default function ThemeApplier() {
    const appearance = useAppearance();

    React.useEffect(() => {
        const root = document.documentElement;
        if (appearance.theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
    }, [appearance.theme]);

    return null;
}


