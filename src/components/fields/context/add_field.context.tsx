'use client'
import React from 'react';

type AddFieldContextType = {
    id: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddFieldContext = React.createContext<AddFieldContextType | undefined>(undefined);

type AddFieldProviderProps = {
    children: React.ReactNode;
    value: Pick<AddFieldContextType, "id">;
}

export const AddFieldProvider = ({ children, value }: AddFieldProviderProps) => {
    const [open, setOpen] = React.useState(false);

    return (
        <AddFieldContext.Provider value={{ id: value.id, open, setOpen }}>
            {children}
        </AddFieldContext.Provider>
    )
}

export const useAddFieldContext = () => {
    const context = React.useContext(AddFieldContext);
    if (!context) {
        throw new Error('useAddFieldContext must be used within an AddFieldProvider');
    }
    return context;
}