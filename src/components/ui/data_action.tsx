import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    enabled?: boolean;
    label: string;
}

export const DataAction = React.forwardRef<HTMLButtonElement, Props>(({ children, enabled, label, ...props }, ref) => {
    return (
        <div className='relative'>
            {enabled && (
                <div className='absolute z-10 top-[-6px] right-[-6px] bg-foreground text-text text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm' />
            )}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={ref}
                        variant='ghost'
                        className="relative h-10 w-10 rounded-lg border border-subtle bg-background text-text hover:bg-hover hover:text-text active:bg-border-strong transition-colors duration-200 shadow-sm"
                        {...props}
                    >
                        {children}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <TooltipWrapper>
                        <span>{label}</span>
                    </TooltipWrapper>
                </TooltipContent>
            </Tooltip>
        </div>
    )
})
DataAction.displayName = "DataAction";