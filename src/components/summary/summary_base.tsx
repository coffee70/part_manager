'use client'
import React from 'react';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipWrapper } from '@/components/ui/tooltip_wrapper';

type Props = {
    title: string;
    children: React.ReactNode;
    action?: () => void;
    label?: string
}

export default function SummaryBase({ title, action, label, children }: Props) {
    const [open, setOpen] = React.useState<boolean>(true);
    return (
        <div className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2'>

            {/** Row 1 Column 1 */}
            <div className='flex justify-center items-center'>
                <button className="flex justify-center items-center w-6 h-6 bg-secondary text-secondary-foreground rounded-sm" onClick={() => setOpen(prev => !prev)}>
                    {open ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
                </button>
            </div>

            {/** Row 1 Column 2 */}
            <div className='flex justify-between items-center'>
                <span className='font-bold text-lg'>{title}</span>
                {action && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type='button'
                                className='flex items-center justify-center w-6 h-6 rounded-sm interactive-subtle'
                                onClick={action}
                                aria-label={`action_${title}`}
                            >
                                <PlusIcon size={20} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <TooltipWrapper>
                                <span>{label}</span>
                            </TooltipWrapper>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            {/** Row 2 Column 1 (empty) */}
            <div className='col-span-1'></div>

            {/** Row 2 Column 2 */}
            {open && <div className="col-span-1">{children}</div>}
        </div>
    )
}