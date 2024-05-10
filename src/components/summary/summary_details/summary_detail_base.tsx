'use client'
import React from "react";

type Props = {
    children: React.ReactNode;
}

export default function DetailBase({ children }: Props) {
    return (
        <div className="flex items-center justify-between space-x-2 min-w-80 min-h-9">
            {children}
        </div>
    )
}