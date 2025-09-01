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
            wrapper: "bg-white ring-1 ring-gray-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-gray-600 group-active:bg-gray-700 group-focus:bg-gray-600 group-hover:ring-gray-600 group-active:ring-gray-700 group-focus:ring-gray-600",
            icon: "text-gray-600 transition-colors duration-150 group-hover:text-white group-active:text-white group-focus:text-white",
        },
        [StepState.Completed]: {
            wrapper: "bg-white ring-1 ring-green-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-green-600 group-active:bg-green-700 group-focus:bg-green-600 group-hover:ring-green-600 group-active:ring-green-700 group-focus:ring-green-600",
            icon: "text-green-600 transition-colors duration-150 group-hover:text-white group-active:text-white group-focus:text-white",
        },
        [StepState.Failed]: {
            wrapper: "bg-white ring-1 ring-red-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-red-600 group-active:bg-red-700 group-focus:bg-red-600 group-hover:ring-red-600 group-active:ring-red-700 group-focus:ring-red-600",
            icon: "text-red-600 transition-colors duration-150 group-hover:text-white group-active:text-white group-focus:text-white",
        },
        [StepState.InProgress]: {
            wrapper: "bg-white ring-1 ring-blue-200 p-1.5 rounded-full transition-colors duration-150 group-hover:bg-blue-600 group-active:bg-blue-700 group-focus:bg-blue-600 group-hover:ring-blue-600 group-active:ring-blue-700 group-focus:ring-blue-600",
            icon: "text-blue-600 transition-colors duration-150 group-hover:text-white group-active:text-white group-focus:text-white",
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