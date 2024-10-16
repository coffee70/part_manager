'use client'
import React from 'react';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type Props = {
    title: string;
    children: React.ReactNode;
    action?: () => void;
    label?: string
}

export default function SummaryBase({ title, action, label, children }: Props) {
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
                    {action && (
                        <Tooltip>
                            <TooltipTrigger>
                                <button
                                    type='button'
                                    className='p-1 rounded-full hover:bg-foreground'
                                    onClick={action}>
                                    <PlusIcon />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className='bg-black text-xs text-white px-2 py-1.5 rounded-md'>{label}</TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {open && children}
            </div>
        </div>
    )
}