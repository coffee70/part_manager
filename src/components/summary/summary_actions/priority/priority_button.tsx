'use client'
import React from "react";
import { ButtonProps } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { darken } from "@/lib/colors";
import { PriorityInfo } from "@/types/collections";

type Props = {
    priorityInfo: PriorityInfo;
}

const PriorityButton = React.forwardRef<HTMLDivElement, ButtonProps & Props>(({ priorityInfo, ...props }, ref) => {

    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
        <div ref={ref} className='flex rounded-sm border text-white font-bold' style={{ backgroundColor: priorityInfo.color }}>
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{priorityInfo.label}</span>
            </div>
            <div className='border-l'></div>
            <button
                {...props}
                className='px-1 rounded-r-sm'
                style={{ 
                    backgroundColor: isHovered ? darken(priorityInfo.color) : priorityInfo.color,
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