import { StepBadge } from "@/components/ui/badge";
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
            <StepBadge step={step} />
        </div>
    )
}