'use client'
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"
import { stepBackgroundVariants } from "./step";
import { StepType } from "@/types/collections";

type BadgeProps = {
    label: string;
    color?: string;
    appendIcon?: React.ReactNode;
    className?: string;
}

export function Badge({ label, color, appendIcon, className }: BadgeProps) {
    return (
        <div
            className={cn("inline-flex items-center rounded-sm text-xs text-white text-nowrap font-bold", className)}
            style={{ backgroundColor: color }}
        >
            <span>{label}</span>
            {appendIcon}
        </div>
    )
}

type StatusBadgeProps = {
    step: {
        id: string;
        name: string;
        type: StepType;
    }
}

export function StepBadge({ step }: StatusBadgeProps) {
    return <Badge
        label={step.name.toUpperCase()}
        className={cn("px-2", stepBackgroundVariants({ variant: step.type }))}
    />
}

type ComboboxBadgeProps = {
    label: string;
    onRemove: () => void;
}

export function ComboboxBadge({ label, onRemove }: ComboboxBadgeProps) {
    return <Badge
        label={label}
        className="mr-1 my-0.5 pl-1.5 bg-foreground text-text text-sm font-normal"
        appendIcon={
            <button
                onClick={onRemove}
                className="ml-0.5 p-1.5 rounded-sm hover:bg-destructive-foreground hover:text-destructive">
                <XIcon
                    size={12}
                    strokeWidth={2.5}
                />
            </button>
        }
    />
}