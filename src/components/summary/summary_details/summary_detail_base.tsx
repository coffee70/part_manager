'use client'
import React from "react";

type Props = {
    children: React.ReactNode;
    label: string;
}

export default function DetailBase({ children, label }: Props) {
    return (
        <div className="flex items-center justify-between space-x-2 min-w-80 min-h-9">
            <div className='text-muted-foreground text-nowrap'>{`${label}:`}</div>
            {children}
        </div>
    )
}