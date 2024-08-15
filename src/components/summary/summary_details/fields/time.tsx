'use client'
import React from 'react';
import { CheckIcon, PencilIcon, TriangleAlertIcon } from "lucide-react";
import { Input as BaseInput } from '../ui/input';
import { cn } from '@/lib/utils';
import { useTimeInput } from '@/hooks/time_input.hook';

type Props = {
    time: string;
    setTime: (time: string) => void;
}

export default function TimeInput({ time, setTime }: Props) {
    const { focused, handleInput, inputRef, handleFocus, handleBlur, invalidTime } = useTimeInput({ time, setTime });
    return (
        <div className={cn('group flex items-center border border-transparent', invalidTime && focused ? 'border-red-600' : !invalidTime && focused ? 'border-border' : 'hover:border-border')}>
            <BaseInput ref={inputRef} value={time} onChange={(e) => handleInput(e)} onFocus={handleFocus} onBlur={handleBlur} />
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
                <button className='bg-red-500 text-white p-1'>
                    <TriangleAlertIcon />
                </button>
            )}
        </div>
    )
}