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
                <div className='absolute z-10 top-[-6px] right-[-6px] bg-stone-700 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm' />
            )}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={ref}
                        variant='ghost'
                        className="relative h-10 w-10 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-200 hover:text-stone-900 hover:border-stone-400 active:bg-stone-300 transition-colors duration-200 shadow-sm"
                        {...props}
                    >
                        {children}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="bg-stone-800 text-white text-xs px-2 py-1.5 rounded-md shadow-sm">
                        <span>{label}</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </div>
    )
})
DataAction.displayName = "DataAction";