'use client'
import SummaryRouteFieldValues from "@/components/summary/summary_sections/summary_route_sections";
import SummaryTitle from "@/components/summary/summary_title/summary_title";
import { SummaryContent, SummaryHeader } from "@/layouts/summary_layout";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import FailStep from "@/components/routes/summary/summary_actions/fail_step";
import CompleteStep from "@/components/routes/summary/summary_actions/complete_step";
import { useRouteActions } from "@/components/routes/hooks/use_route_actions";
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { useStepQueries } from "@/components/routes/hooks/use_step_queries";
import { useRouteHelpers } from "@/components/routes/hooks/use_route_helpers";
import ActionButton from "@/components/summary/summary_actions/action_button";
import { StepState } from "@/types/collections";

export default function SummaryContainer() {
    const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();

    const {
        handleCompleteStep,
        handleFailStep,
        handleStepChange,
        handleCompleteRoute,
    } = useRouteActions("models", modelId, instanceId);

    const {
        route,
        currentStep,
        targetSteps,
    } = useStepQueries("models", modelId, instanceId);

    const routeHelpers = useRouteHelpers(route);

    if (!routeHelpers) return null;
    if (!stepId) return null;

    const {
        isCurrentStep,
        isRouteIdle,
        isRouteCompleted,
        isPreviousStep,
        isNextStep,
        isLastStep
    } = routeHelpers;

    return (
        <>
            <SummaryHeader>
                <SummaryTitle />
                {isCurrentStep(stepId) && !isRouteIdle() && <SummaryToolbar>
                    <CompleteStep onCompleteStep={handleCompleteStep} />
                    <FailStep onFailStep={handleFailStep} />
                </SummaryToolbar>}
                {isRouteIdle() && isCurrentStep(stepId) && (
                    <SummaryToolbar>
                        <ActionButton
                            name="Redo Step"
                            state={currentStep?.type ?? StepState.Completed}
                            idleStyle={true}
                            pausedStyle={false}
                            onClick={() => handleStepChange(stepId)}
                            data-testid="redo-step-button"
                        />
                        {isLastStep(stepId) && (
                            <ActionButton
                                name="Complete Route"
                                state={StepState.Completed}
                                idleStyle={false}
                                pausedStyle={false}
                                onClick={handleCompleteRoute}
                                data-testid="complete-route-button"
                            />
                        )}
                    </SummaryToolbar>
                )}
                {isRouteIdle() && isPreviousStep(stepId) && (
                    <SummaryToolbar>
                        <ActionButton
                            name="Start Step"
                            state={targetSteps?.previous?.type ?? StepState.Completed}
                            idleStyle={false}
                            pausedStyle={false}
                            onClick={() => handleStepChange(stepId)}
                            data-testid="start-step-button"
                        />
                    </SummaryToolbar>
                )}
                {isRouteIdle() && isNextStep(stepId) && (
                    <SummaryToolbar>
                        <ActionButton
                            name="Start Step"
                            state={targetSteps?.next?.type ?? StepState.NotStarted}
                            idleStyle={false}
                            pausedStyle={false}
                            onClick={() => handleStepChange(stepId)}
                            data-testid="start-step-button"
                        />
                    </SummaryToolbar>
                )}
                {isRouteCompleted() && isLastStep(stepId) && (
                    <SummaryToolbar>
                        <ActionButton
                            name="Start Step"
                            state={targetSteps?.last?.type ?? StepState.Completed}
                            idleStyle={true}
                            pausedStyle={false}
                            onClick={() => handleStepChange(stepId)}
                            data-testid="start-step-button"
                        />
                    </SummaryToolbar>
                )}
            </SummaryHeader>
            <SummaryContent>
                <SummaryRouteFieldValues />
            </SummaryContent>
        </>
    )
}   