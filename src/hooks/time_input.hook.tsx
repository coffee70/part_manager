'use client'
import React from 'react';

type UseTimeInputProps = {
    time: string;
    setTime: (time: string) => void;
}

export function useTimeInput({ time, setTime }: UseTimeInputProps) {
    const [focused, setFocused] = React.useState(false);
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
        if (time.length > value.length) {
            return setTime(value)
        } else {
            if (value.length === 2) {
                return setTime(value + ':')
            } else if (value.length === 5) {
                return setTime(value + ':')
            } else if (value.length > 8) {
                return
            } else {
                return setTime(value)
            }
        }
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

    return { focused, handleInput, inputRef, handleFocus, handleBlur, invalidTime }
}