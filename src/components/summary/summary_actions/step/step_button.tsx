'use client'
import { stepBackgroundVariants, stepSummaryButtonDividerVariants, stepSummaryTriggerButtonHoverVariants } from "@/components/ui/step";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { routeKeys } from "@/lib/query_keys";
import { cn } from "@/lib/utils";
import { getRoute } from "@/server/routes/get_route";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { RouteState, StepState } from "@/types/collections";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

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
                return <StepButtonContent
                    ref={ref}
                    name="Not Started"
                    state={StepState.NotStarted}
                    isIdle={false}
                    isPaused={false}
                    {...props}
                />
            case RouteState.Completed:
                return <StepButtonContent
                    ref={ref}
                    name="Done"
                    state={StepState.Completed}
                    isIdle={false}
                    isPaused={false}
                    {...props}
                />
            default:
                return null;
        }
    }

    return <StepButtonContent
        ref={ref}
        name={currentStep.name}
        state={currentStep.type}
        isIdle={route.state === RouteState.Idle}
        isPaused={route.state === RouteState.Paused}
        {...props}
    />

});

StepButton.displayName = 'StepButton'

type StepButtonContentProps = {
    name: string;
    state: StepState;
    isIdle: boolean;
    isPaused: boolean;
}
const StepButtonContent = React.forwardRef<HTMLDivElement, StepButtonContentProps>(({
    name,
    state,
    isIdle,
    isPaused,
    ...props
}, ref) => {
    return (
        <div
            id='step-button'
            ref={ref}
            className={cn(
                "flex rounded-sm border text-white font-bold",
                stepBackgroundVariants({
                    variant: state,
                    paused: isPaused,
                    idle: isIdle
                }),
            )}
        >
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{name}</span>
            </div>
            <div className={cn(
                stepSummaryButtonDividerVariants({
                    variant: state,
                    paused: isPaused,
                    idle: isIdle
                })
            )}></div>
            <button
                {...props}
                id='more-button-dropdown-trigger'
                className={cn(
                    'px-1 rounded-r-sm',
                    stepSummaryTriggerButtonHoverVariants({
                        variant: state,
                        paused: isPaused,
                        idle: isIdle
                    })
                )}
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </button>
        </div>
    )
})

StepButtonContent.displayName = 'StepButtonContent'

export default StepButton
