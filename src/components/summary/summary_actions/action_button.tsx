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
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(({
    name,
    state,
    idleStyle,
    pausedStyle,
    onClick,
    ...props
}, ref) => {
    return (
        <button
            id='step-button'
            ref={ref}
            className={cn(
                "flex rounded-sm border text-white font-bold",
                stepBackgroundVariants({
                    variant: state,
                    paused: pausedStyle,
                    idle: idleStyle
                }),
                stepSummaryTriggerButtonHoverVariants({
                    variant: state,
                    paused: pausedStyle,
                    idle: idleStyle
                })
            )}
            onClick={onClick}
            {...props}
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{name}</span>
            </div>
        </button>)
})

ActionButton.displayName = 'ActionButton'

export default ActionButton