import { StepType } from "@/types/collections";
import StepButton from "./step_button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import StepItem from "./step_item";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertInstance } from "@/server/instances/upsert_instance";
import { instanceKeys } from "@/lib/query_keys";
import { updateStep } from "@/server/routes/update_step";

type Props = {
    step: {
        id: string;
        name: string;
        type: StepType;
    };
    targetSteps: Set<{
        id: string;
        name: string;
        type: StepType;
    }>;
}

export default function Step({ step, targetSteps }: Props) {
    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateStep,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instanceKeys.id(modelId, instanceId) })
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) })
        }
    })

    const handleStepChange = (id: string) => {
        mutate({
            modelId,
            instanceId,
            stepId: id
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StepButton step={step} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {Array.from(targetSteps).map((targetStep, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => handleStepChange(targetStep.id)}
                        >
                            <StepItem step={targetStep} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}