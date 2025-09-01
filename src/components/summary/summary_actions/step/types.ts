import { StepState } from "@/types/collections";

export interface CurrentStep {
    id: string;
    name: string;
    type: StepState;
}

export interface TargetStep {
    id: string;
    instanceId: string;
    number: string;
    type: StepState;
}

export interface TargetSteps {
    previous: TargetStep | null;
    last: TargetStep | null;
    next: TargetStep | null;
}