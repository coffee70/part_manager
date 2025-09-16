'use client'
import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const MoreButton = React.forwardRef<HTMLDivElement, Props>((props, ref) => {

    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            id='more-button'
            ref={ref}
            className='flex rounded-sm bg-secondary text-secondary-foreground border border-secondary-border font-bold'
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>More</span>
            </div>
            <div className='border-l border-secondary-border'></div>
            <button
                {...props}
                id='more-button-dropdown-trigger'
                className={cn(
                    'px-1 rounded-r-sm bg-secondary text-secondary-foreground',
                    isHovered ? 'brightness-90' : 'brightness-100'
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </button>
        </div>
    )
})

MoreButton.displayName = 'MoreButton'

export default MoreButton