import ActionButton from "@/components/summary/summary_actions/action_button";
import { StepState } from "@/types/collections";

export default function CompleteStep({ onCompleteStep }: { onCompleteStep: () => void }) {
    return (
        <ActionButton
            name="Complete Step"
            state={StepState.Completed}
            idleStyle={false}
            pausedStyle={false}
            onClick={onCompleteStep}
            data-testid="complete-step-button"
        />
    );
}