import * as React from 'react';
import { PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotFocusedProps {
    hovered: boolean;
    setHovered: React.Dispatch<React.SetStateAction<boolean>>;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
    value: React.InputHTMLAttributes<HTMLInputElement>['value'];
}

export default function NotFocused({ value, hovered, setHovered, setFocused }: NotFocusedProps) {
    const handleMouseEnter = React.useCallback(() => setHovered(true), [setHovered]);
    const handleMouseLeave = React.useCallback(() => setHovered(false), [setHovered]);
    const handleClick = React.useCallback(() => setFocused(true), [setFocused]);

    return (
        <button className={cn(
            "flex items-center justify-end border border-transparent w-fit text-sm space-x-2",
            hovered ? "border-foreground" : ""
        )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <div
                className={cn(
                    "flex items-center justify-end space-x-2 p-1 border border-transparent",
                )}
            >{value}</div>
            <div className={cn("p-1 bg-foreground", !hovered ? 'invisible disabled' : '')}>
                <PencilIcon />
            </div>
        </button>
    )
}