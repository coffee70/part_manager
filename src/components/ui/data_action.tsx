import React from "react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    enabled?: boolean;
    label: string;
}

export const DataAction = React.forwardRef<HTMLButtonElement, Props>(({ children, enabled, label, ...props }, ref) => {
    return (
        <div className='relative'>
            {enabled && (
                <div className='absolute z-10 top-[-6px] right-[-6px] bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center' />
            )}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={ref}
                        variant='secondary'
                        className="relative rounded-none border border-border h-10 w-10"
                        {...props}
                    >
                        {children}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                        <span>{label}</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </div>
    )
})
DataAction.displayName = "DataAction";