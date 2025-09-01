import { stepBackgroundVariants, stepSummaryButtonDividerVariants, stepSummaryTriggerButtonHoverVariants } from "@/components/ui/step"
import { cn } from "@/lib/utils"
import { StepState } from "@/types/collections"
import { ChevronDownIcon } from "lucide-react"
import React from "react"

type ActionDropdownTriggerProps = {
    name: string;
    state: StepState;
    idleStyle: boolean;
    pausedStyle: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const ActionDropdownTrigger = React.forwardRef<HTMLDivElement, ActionDropdownTriggerProps>(({
    name,
    state,
    idleStyle,
    pausedStyle,
    ...props
}, ref) => {
    return (
        <div
            id='step-button'
            ref={ref}
            className={cn(
                "flex rounded-sm border text-white font-bold",
                stepBackgroundVariants({
                    variant: state,
                    paused: pausedStyle,
                    idle: idleStyle
                }),
            )}
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{name}</span>
            </div>
            <div className={cn(
                stepSummaryButtonDividerVariants({
                    variant: state,
                    paused: pausedStyle,
                    idle: idleStyle
                })
            )}></div>
            <button
                {...props}
                className={cn(
                    'px-1 rounded-r-sm',
                    stepSummaryTriggerButtonHoverVariants({
                        variant: state,
                        paused: pausedStyle,
                        idle: idleStyle
                    })
                )}
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </button>
        </div>
    )
})

ActionDropdownTrigger.displayName = 'ActionDropdownTrigger'

export default ActionDropdownTrigger