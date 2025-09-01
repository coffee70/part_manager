import { StepState } from "@/types/collections";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function colorSpecificStyles(state: StepState, disabled: boolean = false) {
    if (disabled) {
        return "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50";
    }
    
    switch (state) {
        case StepState.NotStarted:
            return "border-green-200 bg-stone-50 text-green-600 hover:bg-green-50 hover:border-green-300 active:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm";
        case StepState.Failed:
            return "border-red-200 bg-stone-50 text-red-600 hover:bg-red-50 hover:border-red-300 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm";
        case StepState.Completed:
            return "border-green-200 bg-stone-50 text-green-600 hover:bg-green-50 hover:border-green-300 active:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm";
        case StepState.InProgress:
            return "border-blue-200 bg-stone-50 text-blue-600 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm";
        default:
            throw new Error(`Unknown step state: ${state}`);
    }
}

type ActionButtonProps = {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    state: StepState;
    className?: string;
    disabled?: boolean;
}

function ActionButton({ icon: Icon, label, onClick, state, className, disabled = false }: ActionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={label}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${colorSpecificStyles(state, disabled)} transition-colors duration-200 ${className ?? ""}`}
                    onClick={disabled ? undefined : onClick}
                    disabled={disabled}
                >
                    <Icon className="h-4 w-4" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md shadow-sm">
                    <span>{label}</span>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}

export { ActionButton };