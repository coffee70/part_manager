import ActionButton from "@/components/summary/summary_actions/action_button";
import { StepState } from "@/types/collections";

type Props = {
    onCompleteStep: () => void;
    isPaused: boolean;
}

export default function CompleteStep({ onCompleteStep, isPaused }: Props) {
    return (
        <ActionButton
            name="Complete Step"
            state={StepState.Completed}
            idleStyle={false}
            pausedStyle={false}
            onClick={onCompleteStep}
            disabled={isPaused}
            data-testid="complete-step-button"
        />
    );
}