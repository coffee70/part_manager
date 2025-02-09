'use client'
import React from "react";
import { ButtonProps } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { darken } from "@/lib/colors";
import { priorityInfo, Priority, priorities, PriorityInfo } from "@/types/collections";

type Props = {
    priority: Priority;
}

const PriorityButton = React.forwardRef<HTMLDivElement, ButtonProps & Props>(({ priority, ...props }, ref) => {

    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let info: PriorityInfo;
    if (priorities.includes(priority)) {
        info = priorityInfo[priority];
    } else {
        info = priorityInfo['Medium'];
    }

    return (
        <div
            id='priority-button'
            ref={ref}
            className='flex rounded-sm border text-white font-bold'
            style={{ backgroundColor: info.color }}
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{priority}</span>
            </div>
            <div className='border-l'></div>
            <button
                {...props}
                id='priority-button-dropdown-trigger'
                className='px-1 rounded-r-sm'
                style={{
                    backgroundColor: isHovered ? darken(info.color) : info.color,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </button>
        </div>
    )
})

PriorityButton.displayName = 'PriorityButton'

export default PriorityButton