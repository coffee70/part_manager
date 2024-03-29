'use client'
import React from 'react'

type InputFocusT = {
    id: number;
    focused: boolean;
}

type FocusContextType = {
    focused: InputFocusT[];
    focus: (id: number) => void;
    blur: (id: number) => void;
}

const FocusContext = React.createContext<FocusContextType | null>(null)

export const useFocusContext = () => {
    const context = React.useContext(FocusContext)
    if (!context) {
        throw new Error('useFocusContext must be used within a FocusProvider')
    }
    return context
}

type FocusProviderProps = {
    ids: number[];
    children: React.ReactNode;
}

export function FocusProvider({ children, ids }: FocusProviderProps) {
    const [focused, setFocused] = React.useState(ids.map(id => ({ id: id, focused: false })))
    const focus = (id: number) => {
        setFocused(prev => prev.map(f => f.id === id ? { id: f.id, focused: true } : { id: f.id, focused: false }))
    }
    const blur = (id: number) => {
        setFocused(prev => prev.map(f => f.id === id ? { id: f.id, focused: false } : f))
    }

    return (
        <FocusContext.Provider value={{ focused, focus, blur }}>
            {children}
        </FocusContext.Provider>
    )
}