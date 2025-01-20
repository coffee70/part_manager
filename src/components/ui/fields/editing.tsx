import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { cn } from '@/lib/utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    error?: boolean;
}

const Editing = React.forwardRef<HTMLButtonElement, Props>(
    ({ className, error, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant='icon'
                className={cn(
                    'grow bg-foreground p-1 rounded-none',
                    error && 'text-white bg-destructive',
                    className
                )}
                type="submit"
                {...props}
            >
                <CheckIcon />
            </Button>
        );
    }
);

Editing.displayName = 'Editing';

export default Editing;