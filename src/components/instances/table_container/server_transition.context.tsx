'use client'
import React from 'react';

type ServerTransitionContextType = {
    isServerTransitionPending: boolean;
    startServerTransition: React.TransitionStartFunction;
}

const ServerTransitionContext = React.createContext<ServerTransitionContextType | null>(null);

export const useServerTransitionContext = () => {
    const context = React.useContext(ServerTransitionContext);
    if (!context) {
        throw new Error('useServerTransitionContext must be used within a ServerTransitionProvider');
    }
    return context;
}

type Props = {
    children: React.ReactNode;
}

export const ServerTransitionProvider = ({ children }: Props) => {
    const [isServerTransitionPending, startServerTransition] = React.useTransition();

    return (
        <ServerTransitionContext.Provider value={{ isServerTransitionPending, startServerTransition }}>
            {children}
        </ServerTransitionContext.Provider>
    )
}