'use client'
import React from 'react';
import { Input as BaseInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { useEditContext } from './edit_context';
import { mergeRefs } from '@/lib/refs';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    
    const { isEditing } = useEditContext();
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    })
    
    return (
        <div className='flex items-center'>
            <BaseInput
                {...props}
                ref={mergeRefs(inputRef, ref)}
            />
            <Button variant='icon' className='bg-foreground p-1'>
                <CheckIcon />
            </Button>
        </div>
    )
})

Input.displayName = 'Input';

export default Input;