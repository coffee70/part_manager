'use client'
import { FieldModel } from '@prisma/client';
import React from 'react';

type FieldModelContextType = {
    fieldModel: FieldModel;
}

const FieldModelContext = React.createContext<FieldModelContextType | undefined>(undefined);

type FieldModelProviderProps = {
    value: FieldModelContextType;
    children: React.ReactNode;
}

export const FieldModelProvider = ({ value, children }: FieldModelProviderProps) => {
    return (
        <FieldModelContext.Provider value={value}>
            {children}
        </FieldModelContext.Provider>
    )
}

export const useFieldModelContext = () => {
    const context = React.useContext(FieldModelContext);
    if (context === undefined) {
        throw new Error('useFieldModelContext must be used within a FieldModelProvider');
    }
    return context;
}