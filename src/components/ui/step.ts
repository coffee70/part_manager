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
    }
}

export const stepBackgroundVariants = cva<Variants>(
    "",
    {
        variants: {
            variant: {
                [StepState.NotStarted]: "bg-gray-600",
                [StepState.Completed]: "bg-green-600",
                [StepState.Failed]: "bg-red-600",
                [StepState.InProgress]: "bg-blue-600"
            },
            paused: {
                true: "bg-transparent text-gray-600 border border-gray-600",
                false: ""
            },
            idle: {
                true: "bg-transparent border",
                false: ""
            }
        },
        compoundVariants: [
            // Paused state: always dark gray text and border, transparent background
            {
                variant: StepState.NotStarted,
                paused: true,
                class: "text-gray-600 border-gray-600"
            },
            {
                variant: StepState.Completed,
                paused: true,
                class: "text-gray-600 border-gray-600"
            },
            {
                variant: StepState.Failed,
                paused: true,
                class: "text-gray-600 border-gray-600"
            },
            {
                variant: StepState.InProgress,
                paused: true,
                class: "text-gray-600 border-gray-600"
            },
            // Idle state: colored text and border matching the variant, transparent background
            {
                variant: StepState.NotStarted,
                idle: true,
                class: "text-gray-600 border-gray-600"
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
        return "border-l border-gray-600";
    }

    if (idle) {
        switch (variant) {
            case StepState.NotStarted:
                return "border-l border-gray-600";
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
    // If both are false, just return border-l (default border color)
    return "border-l";
}

export function stepSummaryTriggerButtonHoverVariants({
    variant,
    paused,
    idle,
}: {
    variant: StepState;
    paused: boolean;
    idle: boolean;
}) {
    if (paused) {
        return "hover:bg-gray-50";
    }

    if (idle) {
        switch (variant) {
            case StepState.NotStarted:
                return "hover:bg-gray-50";
            case StepState.Completed:
                return "hover:bg-green-50";
            case StepState.Failed:
                return "hover:bg-red-50";
            case StepState.InProgress:
                return "hover:bg-blue-50";
            default:
                return "hover:bg-gray-50";
        }
    }
    
    switch (variant) {
        case StepState.NotStarted:
            return "hover:bg-gray-700";
        case StepState.Completed:
            return "hover:bg-green-700";
        case StepState.Failed:
            return "hover:bg-red-700";
        case StepState.InProgress:
            return "hover:bg-blue-700";
        default:
            return "hover:bg-gray-700";
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
            return "hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50";
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