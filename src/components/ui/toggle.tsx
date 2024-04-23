'use client'
import React from "react"

import { cn } from "@/lib/utils";
import { useFilterContext } from "../../context/filters/filter.context";

type Props = {
    label: string;
}

export default function Toggle({ label }: Props) {
    const { setShowArchived, showArchived } = useFilterContext()
    return (
        <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm">{label}</span>
            <button
                className={cn("flex items-center rounded-lg h-4 w-8 relative", showArchived ? 'bg-primary' : 'bg-muted-foreground')}
                onClick={() => setShowArchived(prev => !prev)}
            >
                <div
                    className={cn('bg-white rounded-md h-3 w-3 absolute', showArchived ? 'right-0.5' : 'left-0.5')}
                />
            </button>
        </div>
    )
}