'use client'
import React from 'react';
import { Field, Section } from "@/types/collections";

type SectionContextType = {
    section: Section & {
        fields: Field[];
    }
}

const SectionContext = React.createContext<SectionContextType | null>(null);

export const useSectionContext = () => {
    const context = React.useContext(SectionContext);
    if (!context) {
        throw new Error('useSectionContext must be used within a SectionProvider');
    }
    return context;
}

type Props = {
    section: Section & {
        fields: Field[];
    }
    children: React.ReactNode;
}

export function SectionProvider({ section, children }: Props) {
    return (
        <SectionContext.Provider value={{ section }}>
            {children}
        </SectionContext.Provider>
    )
}