'use client'
import React from 'react';
import { CheckIcon, PencilIcon } from "lucide-react";
import { Input as BaseInput } from '../ui/input';
import { cn } from '@/lib/utils';

function useInput() {
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
    return { focused, inputRef, handleFocus, handleBlur }

}

type Props = {
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    value?: React.InputHTMLAttributes<React.HTMLInputTypeAttribute>['value'];
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Input({ placeholder, type, value, onChange }: Props) {
    const { focused, inputRef, handleFocus, handleBlur } = useInput();
    return (
        <div className={cn('group flex items-center border border-transparent', focused ? 'border-border' : 'hover:border-border')}>
            <BaseInput
                ref={inputRef}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {!focused && (
                <button className='bg-foreground p-1 invisible group-hover:visible' onClick={handleFocus}>
                    <PencilIcon />
                </button>
            )}
            {focused && (
                <button className='bg-foreground p-1' onClick={handleBlur}>
                    <CheckIcon />
                </button>
            )}
        </div>
    )
}