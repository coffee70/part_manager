import * as React from 'react';
import { CheckIcon, PencilIcon } from "lucide-react";
import { cn } from '@/lib/utils';

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props}, ref) => {
        return (
            <textarea
            className={cn(
                "flex min-h-24 w-full bg-transparent resize-none placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

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

function StyledTextarea({ placeholder }: TextareaProps) {
    const { focused, value, setValue, textareaRef, handleFocus, handleBlur } = useTextarea();
    return (
        <div className={cn('group flex items-center border border-transparent', focused ? 'border-border' : 'hover:border-border')}>
            <Textarea ref={textareaRef} className='p-1' placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
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

export { Textarea, StyledTextarea, type TextareaProps, useTextarea }