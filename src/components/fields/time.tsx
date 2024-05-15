'use client'
import React from 'react';
import { CheckIcon, PencilIcon, TriangleAlertIcon } from "lucide-react";
import { Input as BaseInput } from '../ui/input';
import { cn } from '@/lib/utils';

function useTimeInput() {
    const [focused, setFocused] = React.useState(false);
    const [time, setTime] = React.useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleFocus = () => {
        inputRef.current?.focus();
        setFocused(true);
    }
    const handleBlur = () => {
        inputRef.current?.blur();
        setFocused(false);
    }

    // formatter for time
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTime(prev => {
            if (prev.length > value.length) {
                return value
            } else {
                if (value.length === 2) {
                    return value + ':'
                } else if (value.length === 5) {
                    return value + ':'
                } else if (value.length > 8) {
                    return prev
                } else {
                    return value
                }
            }
        })
    }

    // validator for time
    const invalidTime = React.useMemo(() => {

        // string length validator
        if (time.length !== 8) {
            return true
        }

        // number validator
        const [hours, minutes, seconds] = time.split(':').map(Number)
        console.log(hours, minutes, seconds)
        if (isNaN(hours) || hours < 0 || hours > 23) {
            return true
        }
        if (isNaN(minutes) || minutes < 0 || minutes > 59) {
            return true
        }
        if (isNaN(seconds) || seconds < 0 || seconds > 59) {
            return true
        }
        return false
    }, [time])

    return { focused, time, handleInput, inputRef, handleFocus, handleBlur, invalidTime }
}

export default function TimeInput() {
    const { focused, time, handleInput, inputRef, handleFocus, handleBlur, invalidTime } = useTimeInput();
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