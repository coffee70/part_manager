'use client'
import { SectionModel } from '@prisma/client';
import React from 'react';

type SectionModelContextType = {
    sectionModel: SectionModel;
}

const SectionModelContext = React.createContext<SectionModelContextType | undefined>(undefined);

type SectionModelProviderProps = {
    value: SectionModelContextType;
    children: React.ReactNode;
}

export const SectionModelProvider = ({ value, children }: SectionModelProviderProps) => {
    return (
        <SectionModelContext.Provider value={value}>
            {children}
        </SectionModelContext.Provider>
    )
}

export const useSectionModelContext = () => {
    const context = React.useContext(SectionModelContext);
    if (context === undefined) {
        throw new Error('useSectionModelContext must be used within a SectionModelProvider');
    }
    return context;
}