'use client'
import React from 'react';
import { PlusIcon } from 'lucide-react';

type TriggerProps = {
    label: string;
    onClick?: () => void;
}

export default function Trigger({ label, onClick }: TriggerProps)  {
    return (
        <div
            className="flex items-center space-x-1 w-full py-1 text-muted-foreground cursor-pointer"
            onClick={onClick}
        >
            <PlusIcon />
            <span>{label}</span>
        </div>
    )
}