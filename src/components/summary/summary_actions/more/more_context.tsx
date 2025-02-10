'use client'
import React from 'react';

type MoreContextType = {
    commentsTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    attachmentsInputRef: React.RefObject<HTMLInputElement>;
    linkOpen: boolean;
    setLinkOpen: (open: boolean) => void;
}

const MoreContext = React.createContext<MoreContextType | null>(null);

export const useMoreContext = () => {
    const context = React.useContext(MoreContext);
    if (!context) {
        throw new Error('useMoreContext must be used within a MoreProvider');
    }
    return context;
}
type Props = {
    children: React.ReactNode;
}

export function MoreProvider({ children }: Props) {
    const commentsTextAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const attachmentsInputRef = React.useRef<HTMLInputElement>(null);
    const [linkOpen, setLinkOpen] = React.useState(false);

    const value = {
        commentsTextAreaRef,
        attachmentsInputRef,
        linkOpen,
        setLinkOpen,
    }

    return (
        <MoreContext.Provider value={value}>
            {children}
        </MoreContext.Provider>
    )
}