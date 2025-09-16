'use client'
import React from "react"
import { cn } from "@/lib/utils";

type Props = {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export default function Toggle({ label, value, onChange }: Props) {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm">{label}</span>
            <button
                className={cn("flex items-center rounded-lg h-4 w-8 relative", value ? 'bg-primary' : 'bg-muted-foreground')}
                onClick={() => onChange(!value)}
            >
                <div
                    className={cn('bg-background rounded-md h-3 w-3 absolute', value ? 'right-0.5' : 'left-0.5')}
                />
            </button>
        </div>
    )
}