'use client'
import React from 'react';
import { Textarea as BaseTextarea } from '@/components/ui/textarea';
import { CheckIcon, PencilIcon } from "lucide-react";
import { cn } from '@/lib/utils';

function useTextarea() {
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const handleFocus = () => {
        textareaRef.current?.focus();
        setFocused(true);
    }
    const handleBlur = () => {
        textareaRef.current?.blur();
        setFocused(false);
    }
    return { focused, value, setValue, textareaRef, handleFocus, handleBlur }
}

type TextareaProps = {
    placeholder?: string;
}

export default function Textarea({ placeholder }: TextareaProps) {
    const { focused, value, setValue, textareaRef, handleFocus, handleBlur } = useTextarea();
    return (
        <div className={cn('group flex items-center border border-transparent', focused ? 'border-border' : 'hover:border-border')}>
            <BaseTextarea ref={textareaRef} className='p-1' placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
            {!focused && (
                <button className='bg-foreground p-1 h-full invisible group-hover:visible' onClick={handleFocus}>
                    <PencilIcon />
                </button>
            )}
            {focused && (
                <button className='bg-foreground p-1 h-full' onClick={handleBlur}>
                    <CheckIcon />
                </button>
            )}
        </div>
    )
}