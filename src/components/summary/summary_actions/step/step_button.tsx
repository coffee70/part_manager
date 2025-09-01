'use client'
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { RouteState, StepState } from "@/types/collections";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ActionButton from "@/components/summary/summary_actions/action_dropdown_trigger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

const StepButton = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { context, modelId, instanceId } = useInstanceURL();

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
                return <ActionButton
                    ref={ref}
                    name="Not Started"
                    state={StepState.NotStarted}
                    idleStyle={false}
                    pausedStyle={false}
                    {...props}
                />
            case RouteState.Completed:
                return <ActionButton
                    ref={ref}
                    name="Done"
                    state={StepState.Completed}
                    idleStyle={false}
                    pausedStyle={false}
                    {...props}
                />
            default:
                return null;
        }
    }

    return <ActionButton
        ref={ref}
        name={currentStep.name}
        state={currentStep.type}
        idleStyle={route.state === RouteState.Idle}
        pausedStyle={route.state === RouteState.Paused}
        {...props}
    />

});

StepButton.displayName = 'StepButton'

export default StepButton
