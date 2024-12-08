import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

const Editing = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant='icon'
                className={`grow bg-foreground p-1 rounded-none ${className}`}
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