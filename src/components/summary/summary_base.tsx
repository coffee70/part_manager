'use client'
import React from 'react';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Button } from '../ui/button';

type Props = {
    title: string;
    children: React.ReactNode;
    onAdd?: () => void;
}

export default function SummaryBase({ title, onAdd, children }: Props) {
    const [open, setOpen] = React.useState<boolean>(true);
    return (
        <div className="flex space-x-4">
            <button className="flex items-center justify-center w-6 h-6 my-1 bg-foreground rounded-full" onClick={() => setOpen(prev => !prev)}>
                {open && <ChevronDownIcon size={20} />}
                {!open && <ChevronRightIcon size={20} />}
            </button>
            <div className="flex flex-col space-y-2 w-full">
                <div className='flex justify-between items-center'>
                    <span className='font-bold text-lg'>{title}</span>
                    {onAdd && (
                        <button
                            type='button'
                            className='p-1 rounded-full hover:bg-foreground'
                            onClick={onAdd}>
                            <PlusIcon />
                        </button>
                    )}
                </div>
                {open && children}
            </div>
        </div>
    )
}