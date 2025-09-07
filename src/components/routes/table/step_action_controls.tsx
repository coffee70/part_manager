'use client'
import { ExtendedRoute, RouteHelpers } from "@/components/routes/hooks/use_route_helpers";
import RouteTable from "@/components/ui/route_table";
import { StepState } from "@/types/collections";
import { 
    InProgressController, 
    NextStepController, 
    PreviousStepController, 
    RedoStepController,
} from "@/components/routes/table/step_controller";

// Component for step action controls
export function StepActionControls({
    stepId,
    routeHelpers,
    route,
    onUpdateStep,
    onFailStep,
    onCompleteStep
}: {
    stepId: string;
    routeHelpers: RouteHelpers;
    route: ExtendedRoute;
    onUpdateStep: (stepId: string) => void;
    onFailStep: () => void;
    onCompleteStep: () => void;
}) {
    const {
        isCurrentStep,
        isPreviousStep,
        isNextStep,
        isRedoStep,
        isLastStep,
        isRouteCompleted,
        isRouteIdle,
        isRoutePaused,
    } = routeHelpers;

    const step = route.nodes.find(node => node.id === stepId);

    if (!isRouteIdle()) {
        if (isCurrentStep(stepId)) {
            return (
                <RouteTable.Cell>
                    <InProgressController
                        onFailStep={onFailStep}
                        onCompleteStep={onCompleteStep}
                        disabled={isRoutePaused()}
                    />
                </RouteTable.Cell>
            );
        } else if (isRouteCompleted() && isLastStep(stepId)) {
            return (
                <RouteTable.Cell>
                    <PreviousStepController
                        onPreviousStep={() => onUpdateStep(stepId)}
                        state={step?.state ?? StepState.Completed}
                        disabled={isRoutePaused()}
                    />
                </RouteTable.Cell>
            );
        }
        return null;
    }

    // Route is idle - show different controls based on step position
    return (
        <>
            {isPreviousStep(stepId) && (
                <RouteTable.Cell>
                    <PreviousStepController
                        onPreviousStep={() => onUpdateStep(stepId)}
                        state={step?.state ?? StepState.Completed}
                        disabled={isRoutePaused()}
                    />
                </RouteTable.Cell>
            )}
            {isNextStep(stepId) && (
                <RouteTable.Cell>
                    <NextStepController
                        onStartStep={() => onUpdateStep(stepId)}
                        state={step?.state ?? StepState.NotStarted}
                        disabled={isRoutePaused()}
                    />
                </RouteTable.Cell>
            )}
            {isRedoStep(stepId) && (
                <RouteTable.Cell>
                    <RedoStepController
                        onRedoStep={() => onUpdateStep(stepId)}
                        state={step?.state ?? StepState.Completed}
                        disabled={isRoutePaused()}
                    />
                </RouteTable.Cell>
            )}
        </>
    );
}