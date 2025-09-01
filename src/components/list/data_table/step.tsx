import { Badge } from "@/components/ui/badge";
import { RouteState, StepState } from "@/types/collections";
import { StepBadge } from "@/components/ui/badge";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQuery } from "@tanstack/react-query";
import { routeKeys } from "@/lib/query_keys";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { getRoute } from "@/server/routes/get_route";

type Props = {
    instanceId: string;
}

export default function Step({ instanceId }: Props) {
    const { context, modelId } = useInstanceURL();

    // get the route state
    const routeQuery = useQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId,
    });

    // get the current step
    const currentStepQuery = useQuery({
        queryKey: routeKeys.currentStep(modelId, instanceId),
        queryFn: () => getCurrentStep({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId,
    });

    const route = routeQuery.data;
    const currentStep = currentStepQuery.data;

    if (!route) return null;

    if (!currentStep) {
        switch (route.state) {
            case RouteState.Stopped:
                return (
                    <StepBadge
                        step={{
                            id: "not-started",
                            name: "Not Started",
                            type: StepState.NotStarted,
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                    />
                );
            case RouteState.Completed:
                return (
                    <StepBadge
                        step={{
                            id: "done",
                            name: "Done",
                            type: StepState.Completed,
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                    />
                );
            default:
                return null;
        }
    }

    switch (route.state) {
        case RouteState.Paused:
            return (
                <StepBadge
                    step={{
                        id: currentStep.id,
                        name: currentStep.name,
                        type: currentStep.type,
                    }}
                    pausedStyle={true}
                    idleStyle={false}
                />
            );
        case RouteState.Idle:
            return (
                <StepBadge
                    step={{
                        id: currentStep.id,
                        name: currentStep.name,
                        type: currentStep.type,
                    }}
                    pausedStyle={false}
                    idleStyle={true}
                />
            );
        default:
            return (
                currentStep && (
                    <StepBadge
                        step={{
                            id: currentStep.id,
                            name: currentStep.name,
                            type: StepState.InProgress,
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                    />
                )
            );
    }
}