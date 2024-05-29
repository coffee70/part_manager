'use client'
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
}

const DetailBase = React.forwardRef<HTMLDivElement, Props>(({ children, className }, ref) => {
    return (
        <div ref={ref} className={cn("flex items-center justify-between space-x-2 min-w-80 min-h-9", className)}>
            {children}
        </div>
    )
})
DetailBase.displayName = "DetailBase";

export default DetailBase;