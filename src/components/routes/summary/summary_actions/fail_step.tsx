import ActionButton from "@/components/summary/summary_actions/action_button";
import { StepState } from "@/types/collections";

type Props = {
    onFailStep: () => void;
    isPaused: boolean;
}

export default function FailStep({ onFailStep, isPaused }: Props) {
    return (
        <ActionButton
            name="Fail Step"
            state={StepState.Failed}
            idleStyle={false}
            pausedStyle={false}
            onClick={onFailStep}
            disabled={isPaused}
            data-testid="fail-step-button"
        />
    );
}