'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

const NotEditing = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant='icon'
                className={`grow bg-foreground p-1 rounded-none invisible group-hover:visible ${className}`}
                {...props}
            >
                <PencilIcon />
            </Button>
        );
    }
);

NotEditing.displayName = 'NotEditing';

export default NotEditing;