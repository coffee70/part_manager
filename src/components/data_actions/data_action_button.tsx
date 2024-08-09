import React from "react";
import { Button } from "../ui/button";

type Props = {
    children: React.ReactNode;
    enabled?: boolean;
}

export const DataAction = React.forwardRef<HTMLButtonElement, Props>(({ children, enabled, ...props }, ref) => {
    return (
        <div className='relative'>
            {enabled && (
              <div className='absolute z-10 top-[-6px] right-[-6px] bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center' />
            )}
            <Button ref={ref} variant="icon" className="relative bg-foreground border border-border h-10 w-10" {...props}>
                {children}
            </Button>
        </div>
    )
})
DataAction.displayName = "DataAction";