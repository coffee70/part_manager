import React from "react";
import { Button } from "../ui/button";

type Props = {
    children: React.ReactNode;
}

export const DataAction = React.forwardRef<HTMLButtonElement, Props>(({ children, ...props }, ref) => {
    return (
        <Button ref={ref} variant="icon" className="relative bg-secondary border border-border h-10 w-10" {...props}>
            {children}
        </Button>
    )
})
DataAction.displayName = "DataAction";