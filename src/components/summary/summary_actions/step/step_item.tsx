import { stepBackgroundVariants } from "@/components/ui/step";
import { cn } from "@/lib/utils";
import { StepType } from "@/types/collections";
import { MoveRightIcon } from "lucide-react";

type Props = {
    step: {
        id: string;
        name: string;
        type: StepType;
    }
}

export default function StepItem({ step }: Props) {
    return (
        <div className="flex items-center justify-center space-x-6">
            <MoveRightIcon size={24} />
            <div className={cn(
                "px-2 py-1 rounded-sm text-white font-bold text-base",
                stepBackgroundVariants({ variant: step.type })
            )}>
                <span>{step.name}</span>
            </div>
        </div>
    )
}