import { Badge } from "@/components/ui/badge";
import { RouteState } from "@/components/route_builder/list_view/types";
import { StepBadge } from "@/components/ui/badge";
import { StepType } from "@/types/collections";

type Props = {
    state: RouteState;
    currentStep?: {
        id: string;
        name: string;
        type: StepType;
    };
}

export default function Step({ state, currentStep }: Props) {
    return state === RouteState.Stopped ? (
        <StepBadge step={{
            id: "not-started",
            name: "Not Started",
            type: "To-do"
        }} />
    ) : state === RouteState.Paused ? (
        currentStep && <Badge label={currentStep.name.toUpperCase()} className="border border-stone-500 text-stone-500 px-2" />
    ) : state === RouteState.Completed ? (
        <StepBadge step={{
            id: "done",
            name: "Done",
            type: "Done"
        }} />
    ) : (
        currentStep && <StepBadge step={currentStep} />
    )
}