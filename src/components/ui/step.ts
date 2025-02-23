import { StepType } from "@/types/collections"
import { cva } from "class-variance-authority"

export type Variants = {
    variant: {
        [key in StepType]: string
    }
}

export const stepBackgroundVariants = cva<Variants>(
    "",
    {
        variants: {
            variant: {
                "To-do": "bg-gray-600",
                "In-progress": "bg-blue-600",
                "Done": "bg-green-600",
            }
        }
    }
)