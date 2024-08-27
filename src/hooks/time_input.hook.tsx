'use client'
import React from 'react';

type Props = {
    time: string;
    setTime: (time: string) => void;
}

export const MERIDIEM_INDICATORS = ['AM', 'PM'] as const;
export type Meridiem = typeof MERIDIEM_INDICATORS[number];

export function useTimeInput({ time, setTime }: Props) {
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key;

        // backspace handler
        if (key === 'Backspace') {
            setTime(time.slice(0, -1));
            return;
        }

        if (key === ':' && (time.length === 2 || time.length === 5)) {
            setTime(time + ':');
            return;
        }

        // number validator
        if (!/^\d*$/.test(key)) {
            return;
        }

        // time formatter
        if (time.length === 2 || time.length === 5) {
            setTime(time + ':' + key);
            return;
        }

        // string length validator
        if (time.length >= 8) {
            return;
        }

        setTime(time + key);
    }

    // validator for time
    const invalidTime = React.useMemo(() => {

        // string length validator
        if (time.length !== 8) {
            return true
        }

        // number validator
        const [hours, minutes, seconds] = time.split(':').map(Number)
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

    return { focused, handleKeyDown, inputRef, handleFocus, handleBlur, invalidTime }
}