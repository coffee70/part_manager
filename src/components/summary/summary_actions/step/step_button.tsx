'use client'
import { stepBackgroundVariants } from "@/components/ui/step";
import { cn } from "@/lib/utils";
import { StepType } from "@/types/collections";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    step: {
        id: string;
        name: string;
        type: StepType;
    };
}

const StepButton = React.forwardRef<HTMLDivElement, Props>(({ step, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            id='step-button'
            ref={ref}
            className={cn(
                "flex rounded-sm border text-white font-bold",
                stepBackgroundVariants({ variant: step.type })
            )}
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{step.name}</span>
            </div>
            <div className='border-l'></div>
            <button
                {...props}
                id='more-button-dropdown-trigger'
                className={cn(
                    'px-1 rounded-r-sm',
                    stepBackgroundVariants({ variant: step.type }),
                    isHovered ? 'brightness-90' : 'brightness-100'
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </button>
        </div>
    )
});

StepButton.displayName = 'StepButton'

export default StepButton