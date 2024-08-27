'use client'
import React from 'react';
import { CheckIcon, PencilIcon, TriangleAlertIcon, ChevronDownIcon } from "lucide-react";
import { Input as BaseInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MERIDIEM_INDICATORS, type Meridiem, useTimeInput } from "@/hooks/time_input.hook";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {
    time: string;
    setTime: (time: string) => void;
}

export default function TimeInput({ time, setTime }: Props) {
    const { focused, handleKeyDown, inputRef, handleFocus, handleBlur, invalidTime } = useTimeInput({ time, setTime });
    return (
        <div className={cn('group flex items-center border border-transparent', invalidTime && focused ? 'border-alert' : !invalidTime && focused ? 'border-border' : 'hover:border-border')}>
            <BaseInput ref={inputRef} value={time} onKeyDown={handleKeyDown} onFocus={handleFocus} onBlur={handleBlur} />
            <MeridiemInput indicator="AM" setIndicator={() => {}} />
            {!focused && (
                <button className='bg-foreground p-1 invisible group-hover:visible' onClick={handleFocus}>
                    <PencilIcon />
                </button>
            )}
            {focused && !invalidTime && (
                <button className='bg-foreground p-1' onClick={handleBlur}>
                    <CheckIcon />
                </button>
            )}
            {focused && invalidTime && (
                <button className='bg-alert text-alert-foreground p-1'>
                    <TriangleAlertIcon />
                </button>
            )}
        </div>
    )
}

type MeridiemInputProps = {
    indicator: Meridiem;
    setIndicator: (indicator: Meridiem) => void;
}

function MeridiemInput({ indicator, setIndicator }: MeridiemInputProps) {
    return (
        <>
            <BaseInput
                className='hidden'
                value={indicator}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center">
                        {indicator}
                        <ChevronDownIcon size={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {MERIDIEM_INDICATORS.map(indicator => (
                            <DropdownMenuItem key={indicator} onClick={() => setIndicator(indicator)}>
                                {indicator}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}