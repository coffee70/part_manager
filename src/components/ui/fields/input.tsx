import React from 'react';
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
    label?: React.ReactNode;
    error?: React.ReactNode;
    description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, error, description, className } = props;
    return (
        <div className="flex flex-col space-y-0.5">
            {label && <label className='text-sm' htmlFor={props.id}>{label}</label>}
            <BaseInput ref={ref} {...props} className={cn(
                'border border-subtle shadow-sm rounded-md p-1 no-icon',
                error ? 'border-destructive' : '',
                className
            )} />
            {error && <span className='text-xs text-destructive'>
                {Array.isArray(error) ? error.map((e, i) => <div key={i}>{e}</div>) : error}
            </span>}
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
    )
})

Input.displayName = 'Input';

export { Input };
