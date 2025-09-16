import { stepBackgroundVariants, stepSummaryTriggerButtonHoverVariants } from "@/components/ui/step"
import { cn } from "@/lib/utils"
import { StepState } from "@/types/collections"
import React from "react"

type ActionButtonProps = {
    name: string
    state: StepState
    idleStyle: boolean
    pausedStyle: boolean
    onClick: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(({
    name,
    state,
    idleStyle,
    pausedStyle,
    onClick,
    disabled,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "flex rounded-sm border font-bold disabled:cursor-not-allowed disabled:opacity-50",
                stepBackgroundVariants({
                    variant: state,
                    paused: pausedStyle,
                    idle: idleStyle,
                }),
                stepSummaryTriggerButtonHoverVariants({
                    variant: state,
                    paused: pausedStyle,
                    idle: idleStyle,
                    disabled: disabled
                })
            )}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{name}</span>
            </div>
        </button>)
})

ActionButton.displayName = 'ActionButton'

export default ActionButton