import { StepBadge } from "@/components/ui/badge";
import { StepState } from "@/types/collections";
import { MoveRightIcon, MoveLeftIcon, RotateCwIcon, CheckIcon } from "lucide-react";

type Props = {
    step: {
        id: string;
        name: string;
        type: StepState;
    }
    pausedStyle: boolean;
    idleStyle: boolean;
    action: "next" | "redo" | "back" | "done";
}

export default function StepItem({ step, pausedStyle, idleStyle, action }: Props) {
    const Icon = action === "next"
        ? MoveRightIcon
        : action === "redo"
        ? RotateCwIcon
        : action === "back"
        ? MoveLeftIcon
        : CheckIcon;

    const styleByType: Record<StepState, { wrapper: string; icon: string }> = {
        [StepState.NotStarted]: {
            wrapper: "bg-background ring-1 ring-border p-1.5 rounded-full transition-colors duration-150 group-hover:bg-foreground group-active:bg-foreground group-focus:bg-foreground group-hover:ring-border-strong group-active:ring-border-strong group-focus:ring-border-strong",
            icon: "icon-muted transition-colors duration-150 group-hover:text-text group-active:text-text group-focus:text-text",
        },
        [StepState.Completed]: {
            wrapper: "bg-background ring-1 ring-green-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-green-600 group-active:bg-green-700 group-focus:bg-green-600 group-hover:ring-green-600 group-active:ring-green-700 group-focus:ring-green-600",
            icon: "text-green-600 transition-colors duration-150 group-hover:text-primary-foreground group-active:text-primary-foreground group-focus:text-primary-foreground",
        },
        [StepState.Failed]: {
            wrapper: "bg-background ring-1 ring-red-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-red-600 group-active:bg-red-700 group-focus:bg-red-600 group-hover:ring-red-600 group-active:ring-red-700 group-focus:ring-red-600",
            icon: "text-red-600 transition-colors duration-150 group-hover:text-primary-foreground group-active:text-primary-foreground group-focus:text-primary-foreground",
        },
        [StepState.InProgress]: {
            wrapper: "bg-background ring-1 ring-blue-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-blue-600 group-active:bg-blue-700 group-focus:bg-blue-600 group-hover:ring-blue-600 group-active:ring-blue-700 group-focus:ring-blue-600",
            icon: "text-blue-600 transition-colors duration-150 group-hover:text-primary-foreground group-active:text-primary-foreground group-focus:text-primary-foreground",
        },
    };

    const iconWrapperClass = styleByType[step.type].wrapper;
    const iconClass = styleByType[step.type].icon;

    return (
        <div className="flex items-center justify-center space-x-6">
            <div className={iconWrapperClass}>
                <Icon size={18} className={iconClass} />
            </div>
            <StepBadge step={step} pausedStyle={pausedStyle} idleStyle={idleStyle} />
        </div>
    )
}