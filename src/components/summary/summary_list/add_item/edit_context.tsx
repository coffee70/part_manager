'use client'
import React from 'react';

type EditContextType = {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditContext = React.createContext<EditContextType | undefined>(undefined);

type EditProviderProps = {
    children: React.ReactNode;
}

export const EditProvider = ({ children }: EditProviderProps) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);

    return (
        <EditContext.Provider value={{ isEditing, setIsEditing }}>
            {children}
        </EditContext.Provider>
    );
};

export const useEditContext = () => {
   const context = React.useContext(EditContext);
    if (!context) {
         throw new Error('useEditContext must be used within an EditProvider');
    }
    return context;
};