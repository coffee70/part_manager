import { StepType } from "@/types/collections";
import StepButton from "./step_button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import StepItem from "./step_item";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertInstance } from "@/server/instances/upsert_instance";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { updateStep } from "@/server/routes/update_step";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { Skeleton } from "@/components/ui/skeleton";
import { hasRoute } from "@/server/routes/has_route";
import { getTargetSteps } from "@/server/routes/get_target_steps";

export default function Step() {
    const { context, modelId, instanceId } = useInstanceURL();
    const queryClient = useQueryClient();
    
    // Check if context is 'models' and the instance has a route
    const { data: hasRouteData, isLoading: isLoadingHasRoute } = useQuery({
        queryKey: routeKeys.hasRoute(modelId, instanceId),
        queryFn: () => hasRoute({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId,
    });

    // Fetch the current step data only if the instance has a route
    const { data: currentStep, isLoading: isLoadingCurrentStep } = useQuery({
        queryKey: routeKeys.currentStep(modelId, instanceId),
        queryFn: () => getCurrentStep({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId && !!hasRouteData,
    });
    
    // Fetch possible target steps
    const { data: targetSteps, isLoading: isLoadingTargetSteps } = useQuery({
        queryKey: routeKeys.targetSteps(modelId, instanceId),
        queryFn: () => getTargetSteps({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId && !!hasRouteData,
    });

    const { mutate } = useMutation({
        mutationFn: updateStep,
        onSuccess: () => {
            if (context === "models" && modelId && instanceId) {
                queryClient.invalidateQueries({ queryKey: instanceKeys.id("models", modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", modelId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
            }
        }
    });

    const handleStepChange = (id: string) => {
        if (context === "models" && modelId && instanceId) {
            mutate({
                modelId,
                instanceId,
                stepId: id
            });
        }
    };

    // Return null if not in 'models' context
    if (context !== "models") return null;
    
    // Return null if hasRoute is false
    if (!isLoadingHasRoute && !hasRouteData) return null;
    
    // Show loading state
    if (isLoadingHasRoute || isLoadingCurrentStep || isLoadingTargetSteps) {
        return <Skeleton className="h-8 w-24" />;
    }

    if (!currentStep) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StepButton step={currentStep} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {targetSteps && targetSteps.length > 0 ? (
                        targetSteps.map((targetStep, index) => (
                            <DropdownMenuItem
                                key={targetStep._id}
                                onClick={() => handleStepChange(targetStep._id)}
                            >
                                <StepItem 
                                    step={{
                                        id: targetStep._id,
                                        name: targetStep.number,
                                        type: "To-do" as StepType
                                    }} 
                                />
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            There are no further steps
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}