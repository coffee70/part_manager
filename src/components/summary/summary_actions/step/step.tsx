'use client'
import React, { useState } from "react";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { useStepQueries } from "@/components/routes/hooks/use_step_queries";
import { useRouteActions } from "@/components/routes/hooks/use_route_actions";
import DeleteRouteDialog from "../../../routes/components/delete_route_dialog";
import StopRouteDialog from "../../../routes/components/stop_route_dialog";
import StepDropdown from "./step_dropdown";
import Builder from "@/components/route_builder/list_view/builder";
import { useRouter } from "next/navigation";
import { router } from "@/lib/url";
import { RouteState } from "@/types/collections";

/**
 * Main Step component that orchestrates the queries and actions
 * related to route steps and provides UI for interacting with them.
 */
export default function Step() {
    const nextRouter = useRouter();
    const { context, modelId, instanceId } = useInstanceURL();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stopDialogOpen, setStopDialogOpen] = useState(false);
    const routeListViewTriggerRef = React.useRef<HTMLButtonElement>(null);

    // Get route data from queries
    const {
        hasRoute,
        isLoading,
        currentStep,
        targetSteps,
        route,
        routeIsOnLastStep
    } = useStepQueries(context, modelId, instanceId);

    // Get route actions
    const {
        handleStepChange,
        handleDeleteRoute,
        deleteRouteMutation,
        handlePauseRoute,
        handleStopRoute,
        handleResumeRoute,
        handleCompleteRoute,
        handleCompleteStep,
        handleFailStep,
        handleStartRoute,
        updateRouteStateMutation
    } = useRouteActions(context, modelId, instanceId);

    // Return null if not in 'models' context
    if (context !== "models") return null;

    // Show loading state
    if (isLoading) {
        return <Skeleton className="h-8 w-24" />;
    }

    // Return null if hasRoute is false
    if (!hasRoute || !route) return null;

    const handleOpenRouteListView = () => {
        routeListViewTriggerRef.current?.click();
    }

    const handleViewCurrentStep = () => {
        if (!currentStep) return;
        nextRouter.push(router().routers().instances().instance(route.routerId, currentStep.instanceId));
    }

    const handleViewRoute = () => {
        if (!instanceId) return;
        if (currentStep?.id) {
            nextRouter.push(router().models().instances().step(modelId, instanceId, currentStep.id));
        } else if (route.state === RouteState.Completed) {
            nextRouter.push(router().models().instances().step(modelId, instanceId, RouteState.Completed));
        } else if (route.state === RouteState.Stopped) {
            nextRouter.push(router().models().instances().step(modelId, instanceId, RouteState.Stopped));
        } else {
            nextRouter.push(router().models().instances().routing(modelId, instanceId));
        }
    }

    const handleConfirmStopRoute = () => {
        handleStopRoute();
        setStopDialogOpen(false);
    }

    const handleConfirmDeleteRoute = () => {
        handleDeleteRoute();
        setDeleteDialogOpen(false);
    }

    return (
        <>
            <Builder route={route}>
                <button
                    ref={routeListViewTriggerRef}
                    style={{ display: 'none' }}
                    aria-hidden="true"
                >
                    Open Builder
                </button>
            </Builder>

            <DeleteRouteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onDelete={handleConfirmDeleteRoute}
                isPending={deleteRouteMutation.isPending}
                isError={deleteRouteMutation.isError}
                error={deleteRouteMutation.error}
            />

            <StopRouteDialog
                open={stopDialogOpen}
                onOpenChange={setStopDialogOpen}
                onStop={handleConfirmStopRoute}
                isPending={updateRouteStateMutation.isPending}
                isError={updateRouteStateMutation.isError}
                error={updateRouteStateMutation.error}
            />

            <StepDropdown
                targetSteps={targetSteps}
                isPaused={route.state === RouteState.Paused}
                isCompleted={route.state === RouteState.Completed}
                isStopped={route.state === RouteState.Stopped}
                isIdle={route.state === RouteState.Idle}
                isOnLastStep={routeIsOnLastStep}
                onStepChange={handleStepChange}
                onDeleteClick={() => setDeleteDialogOpen(true)}
                onOpenRouteListView={handleOpenRouteListView}
                onViewCurrentStep={handleViewCurrentStep}
                onViewRoute={handleViewRoute}
                onPauseRoute={handlePauseRoute}
                onStopRoute={() => setStopDialogOpen(true)}
                onResumeRoute={handleResumeRoute}
                onStartRoute={handleStartRoute}
                onCompleteRoute={handleCompleteRoute}
                onCompleteStep={handleCompleteStep}
                onFailStep={handleFailStep}
            />
        </>
    );
}