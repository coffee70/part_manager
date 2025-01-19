import React from 'react';
import { Textarea as BaseTextarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";

type Props = {
    label?: string;
    error?: React.ReactNode;
    description?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { label, error, description, className } = props;
    return (
        <div className="flex flex-col space-y-0.5">
            {label && <label className='text-sm' htmlFor={props.id}>{label}</label>}
            <BaseTextarea ref={ref} {...props} className={cn(
                'border border-accent-foreground shadow-sm rounded-md p-1 no-icon',
                error ? 'border-destructive' : '',
                className
            )} />
            {error && <span className='text-xs text-destructive'>{error}</span>}
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
    )
})

Textarea.displayName = 'Input';

export { Textarea };