'use client'
import React from "react"

import { cn } from "@/lib/utils";

type Props = {
    label: string;
}

export default function Toggle({ label }: Props) {
    const [active, setActive] = React.useState(false);
    return (
        <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm">{label}</span>
            <button
                className={cn("flex items-center rounded-lg h-4 w-8 relative", active ? 'bg-primary' : 'bg-muted-foreground')}
                onClick={() => setActive(prev => !prev)}
            >
                <div
                    className={cn('bg-white rounded-md h-3 w-3 absolute', active ? 'right-0.5' : 'left-0.5')}
                />
            </button>
        </div>
    )
}