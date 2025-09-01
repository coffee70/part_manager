import ActionButton from "@/components/summary/summary_actions/action_button";
import { StepState } from "@/types/collections";

export default function FailStep({ onFailStep }: { onFailStep: () => void }) {
    return (
        <ActionButton
            name="Fail Step"
            state={StepState.Failed}
            idleStyle={false}
            pausedStyle={false}
            onClick={onFailStep}
        />
    );
}