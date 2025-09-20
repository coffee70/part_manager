import { StepState } from "@/types/collections"
import { cva } from "class-variance-authority"

export type Variants = {
    variant: {
        [key in StepState]: string
    },
    paused: {
        true: string,
        false: string
    },
    idle: {
        true: string,
        false: string
    },
    disabled: {
        true: string,
        false: string
    }
}

export const stepBackgroundVariants = cva<Variants>(
    "",
    {
        variants: {
            variant: {
                [StepState.NotStarted]: "bg-gray-600 text-primary-foreground",
                [StepState.Completed]: "bg-green-600 text-primary-foreground",
                [StepState.Failed]: "bg-red-600 text-primary-foreground",
                [StepState.InProgress]: "bg-blue-600 text-primary-foreground"
            },
            paused: {
                true: "bg-transparent text-muted border border-accent-foreground",
                false: ""
            },
            idle: {
                true: "bg-transparent border",
                false: ""
            },
            disabled: {
                true: "bg-border-strong",
                false: ""
            }
        },
        compoundVariants: [
            // Paused state: always dark gray text and border, transparent background
            {
                variant: StepState.NotStarted,
                paused: true,
                class: "text-accent-secondary border-accent-foreground"
            },
            {
                variant: StepState.Completed,
                paused: true,
                class: "text-accent-secondary border-accent-foreground"
            },
            {
                variant: StepState.Failed,
                paused: true,
                class: "text-accent-secondary border-accent-foreground"
            },
            {
                variant: StepState.InProgress,
                paused: true,
                class: "text-accent-secondary border-accent-foreground"
            },
            // Idle state: colored text and border matching the variant, transparent background
            {
                variant: StepState.NotStarted,
                idle: true,
                class: "text-accent-secondary border-accent-foreground"
            },
            {
                variant: StepState.Completed,
                idle: true,
                class: "text-green-600 border-green-600"
            },
            {
                variant: StepState.Failed,
                idle: true,
                class: "text-red-600 border-red-600"
            },
            {
                variant: StepState.InProgress,
                idle: true,
                class: "text-blue-600 border-blue-600"
            }
        ]
    }
)

// Custom function to handle the logic as described
export function stepSummaryButtonDividerVariants({
    variant,
    paused,
    idle,
}: {
    variant: StepState;
    paused: boolean;
    idle: boolean;
}) {
    // If either paused or idle, use the border color for the step state
    if (paused) {
        return "border-l border-slate-200";
    }

    if (idle) {
        switch (variant) {
            case StepState.NotStarted:
                return "border-l border-accent-foreground";
            case StepState.Completed:
                return "border-l border-green-600";
            case StepState.Failed:
                return "border-l border-red-600";
            case StepState.InProgress:
                return "border-l border-blue-600";
            default:
                return "border-l";
        }
    }
    return "border-l border-slate-200";
}

export function stepSummaryTriggerButtonHoverVariants({
    variant,
    paused,
    idle,
    disabled,
}: {
    variant: StepState;
    paused: boolean;
    idle: boolean;
    disabled?: boolean;
}) {
    if (disabled) {
        return "";
    }

    if (paused) {
        return "hover:bg-hover";
    }

    if (idle) {
        switch (variant) {
            case StepState.NotStarted:
                return "hover:bg-hover";
            case StepState.Completed:
                return "hover:bg-green-50";
            case StepState.Failed:
                return "hover:bg-red-50";
            case StepState.InProgress:
                return "hover:bg-blue-50";
            default:
                return "hover:bg-hover";
        }
    }
    
    switch (variant) {
        case StepState.NotStarted:
            return "hover:bg-border-strong";
        case StepState.Completed:
            return "hover:bg-green-700";
        case StepState.Failed:
            return "hover:bg-red-700";
        case StepState.InProgress:
            return "hover:bg-blue-700";
        default:
            return "hover:bg-border-strong";
    }
}

// DropdownItem background variants based on step type
export function stepDropdownItemBackgroundVariants({
    variant,
}: {
    variant: StepState;
}) {
    switch (variant) {
        case StepState.NotStarted:
            return "hover:bg-hover active:bg-border focus:bg-hover";
        case StepState.Completed:
            return "hover:bg-green-50 active:bg-green-100 focus:bg-green-50";
        case StepState.Failed:
            return "hover:bg-red-50 active:bg-red-100 focus:bg-red-50";
        case StepState.InProgress:
            return "hover:bg-blue-50 active:bg-blue-100 focus:bg-blue-50";
        default:
            return "hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50";
    }
}