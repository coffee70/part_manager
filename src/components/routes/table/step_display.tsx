'use client'
import { RouteHelpers, ExtendedRoute } from "@/components/routes/hooks/use_route_helpers";
import RouteTable from "@/components/ui/route_table";
import { StepBadge } from "@/components/ui/badge";
import { FailedIdleIcon, CompletedIdleIcon, PausedIcon } from "@/components/ui/icons/icons";
import { Spacer } from "@/components/routes/components/spacer";
import Pulse from "@/components/ui/pulse";
import { CompletedIcon, FailedIcon, NotStartedIcon } from "@/components/ui/icons/icons";
import { StepState } from "@/types/collections";

// Component for step display (icon + badge)
export function StepDisplay({ 
    stepId, 
    stepName, 
    routeHelpers,
    route,
}: {
    stepId: string;
    stepName: string;
    routeHelpers: RouteHelpers;
    route: ExtendedRoute;
}) {

    const { 
        isCurrentStep, 
        isStepCompleted, 
        isStepFailed, 
        isRouteCompleted, 
        isRouteIdle, 
        isRoutePaused,
    } = routeHelpers;
    
    const step = route.nodes.find(node => node.id === stepId);

    // Determine icon and step type based on current state
    const getStepDisplayInfo = () => {
        if (isCurrentStep(stepId)) {
            if (isRouteIdle()) {
                if (isStepFailed(stepId)) {
                    return {
                        icon: <FailedIdleIcon />,
                        type: step?.state ?? StepState.Completed,
                        idleStyle: true,
                        pausedStyle: false
                    };
                } else if (isStepCompleted(stepId)) {
                    return {
                        icon: <CompletedIdleIcon />,
                        type: step?.state ?? StepState.Completed,
                        idleStyle: true,
                        pausedStyle: false
                    };
                } else {
                    return {
                        icon: null,
                        type: step?.state ?? StepState.Completed,
                        idleStyle: true,
                        pausedStyle: false
                    };
                }
            } else if (isRoutePaused()) {
                return {
                    icon: <PausedIcon />,
                    type: StepState.NotStarted,
                    idleStyle: false,
                    pausedStyle: true
                };
            } else {
                return {
                    icon: <Pulse />,
                    type: StepState.InProgress,
                    idleStyle: false,
                    pausedStyle: false
                };
            }
        } else if (isStepCompleted(stepId)) {
            return {
                icon: <CompletedIcon />,
                type: StepState.Completed,
                idleStyle: false,
                pausedStyle: false
            };
        } else if (isStepFailed(stepId)) {
            return {
                icon: <FailedIcon />,
                type: StepState.Failed,
                idleStyle: false,
                pausedStyle: false
            };
        } else if (isRouteCompleted()) {
            return {
                icon: <CompletedIcon />,
                type: StepState.Completed,
                idleStyle: false,
                pausedStyle: false
            };
        } else {
            return {
                icon: <NotStartedIcon />,
                type: StepState.NotStarted,
                idleStyle: false,
                pausedStyle: false
            };
        }
    };

    const { icon, type, idleStyle, pausedStyle } = getStepDisplayInfo();

    return (
        <RouteTable.Cell>
            <Spacer>
                {icon}
                <StepBadge
                    step={{
                        id: stepId,
                        name: stepName,
                        type
                    }}
                    pausedStyle={pausedStyle}
                    idleStyle={idleStyle}
                />
            </Spacer>
        </RouteTable.Cell>
    );
}