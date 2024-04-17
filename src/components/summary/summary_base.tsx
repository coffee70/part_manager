'use client'
import React from 'react';
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

type Props = {
    title: string;
    children: React.ReactNode;
}

export default function SummaryBase({ title, children }: Props) {
    const [open, setOpen] = React.useState<boolean>(true);
    return (
        <div className="flex space-x-4">
            <button className="flex-none w-6 h-6 bg-foreground rounded-full" onClick={() => setOpen(prev => !prev)}>
                {open && <ChevronDownIcon />}
                {!open && <ChevronRightIcon />}
            </button>
            <div className="flex flex-col space-y-2 w-full">
                <span className='font-bold text-lg'>{title}</span>
                {open && children}
            </div>
        </div>
    )
}