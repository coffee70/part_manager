'use client'
import React from 'react';
import { CheckIcon, PencilIcon } from "lucide-react";
import { Input as BaseInput } from '../ui/input';
import { cn } from '@/lib/utils';

function useInput() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleFocus = () => {
        inputRef.current?.focus();
        setOpen(true);
    }
    const handleBlur = () => {
        inputRef.current?.blur();
        setOpen(false);
    }
    return { open, value, setValue, inputRef, handleFocus, handleBlur }

}

export default function Input() {
    const { open, value, setValue, inputRef, handleFocus, handleBlur } = useInput();
    return (
        <div className={cn('group flex items-center border border-transparent', open ? 'border-border' : 'hover:border-border')}>
            <BaseInput ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onFocus={handleFocus} onBlur={handleBlur}/>
            {!open && (
                <button className='bg-foreground p-1 invisible group-hover:visible' onClick={handleFocus}>
                    <PencilIcon />
                </button>
            )}
            {open && (
                <button className='bg-foreground p-1' onClick={handleBlur}>
                    <CheckIcon />
                </button>
            )}
        </div>
    )
}