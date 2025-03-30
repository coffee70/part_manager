'use client'
import React, { useState } from "react";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { useStepQueries } from "./use_step_queries";
import { useRouteActions } from "./use_route_actions";
import DeleteRouteDialog from "./delete_route_dialog";
import StopRouteDialog from "./stop_route_dialog";
import StepDropdown from "./step_dropdown";
import Builder from "@/components/route_builder/list_view/builder";
import { useRouter } from "next/navigation";
import { router } from "@/lib/url";
import { RouteState } from "@/components/route_builder/list_view/types";

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
        isOnLastStep
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
        updateRouteStateMutation
    } = useRouteActions(context, modelId, instanceId, () => setDeleteDialogOpen(false));

    const handleOpenRouteListView = () => {
        routeListViewTriggerRef.current?.click();
    }

    const handleViewCurrentStep = () => {
        if (!route?.routerId || !currentStep?._id) return;
        nextRouter.push(router().routers().instances().instance(route.routerId, currentStep._id));
    }

    const handleConfirmStopRoute = () => {
        handleStopRoute();
        setStopDialogOpen(false);
    }

    // Return null if not in 'models' context
    if (context !== "models") return null;

    // Show loading state
    if (isLoading) {
        return <Skeleton className="h-8 w-24" />;
    }

    // Return null if hasRoute is false
    if (!hasRoute || !route) return null;

    // Return null if currentStep is null or undefined
    if (!currentStep && route.state !== RouteState.Completed) return null;


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
                onDelete={handleDeleteRoute}
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
                currentStep={currentStep}
                targetSteps={targetSteps}
                isPaused={route.state === RouteState.Paused}
                isCompleted={route.state === RouteState.Completed}
                isStopped={route.state === RouteState.Stopped}
                isOnLastStep={isOnLastStep}
                onStepChange={handleStepChange}
                onDeleteClick={() => setDeleteDialogOpen(true)}
                onOpenRouteListView={handleOpenRouteListView}
                onViewCurrentStep={handleViewCurrentStep}
                onPauseRoute={handlePauseRoute}
                onStopRoute={() => setStopDialogOpen(true)}
                onResumeRoute={handleResumeRoute}
                onCompleteRoute={handleCompleteRoute}
            />
        </>
    );
}