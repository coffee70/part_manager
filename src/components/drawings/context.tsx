'use client'
import React, { useState, createContext } from 'react';

export type Pointer = "select" | "add" | "delete"

interface DrawingViewerContextProps {
    numPages: number;
    setNumPages: React.Dispatch<React.SetStateAction<number>>;
    pageNumber: number;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    pointer: Pointer;
    setPointer: React.Dispatch<React.SetStateAction<Pointer>>;
}

const DrawingViewerContext = createContext<DrawingViewerContextProps | undefined>(undefined);

export const useDrawingViewerContext = () => {
    const context = React.useContext(DrawingViewerContext);
    if (!context) {
        throw new Error('useDrawingViewerContext must be used within a DrawingViewerProvider');
    }
    return context;
}

type DrawingViewerProviderProps = {
    children: React.ReactNode;
};

export const DrawingViewerProvider = ({ children }: DrawingViewerProviderProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pointer, setPointer] = useState<Pointer>('select');

    return (
        <DrawingViewerContext.Provider value={{ numPages, setNumPages, pageNumber, setPageNumber, pointer, setPointer }}>
            {children}
        </DrawingViewerContext.Provider>
    );
};