import { LucideIcon } from "lucide-react";
import React from "react";

type Props = {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
}
export function PageTitle({ title, subtitle, icon }: Props) {
    return (
        <div className="flex items-center space-x-4">
            <div className='flex items-center justify-center w-14 h-14 bg-foreground rounded-md text-text'>
                {icon}
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{title}</h1>
                {subtitle && <h3 className="text-lg text-accent-secondary">{subtitle}</h3>}
            </div>
        </div>
    )
}