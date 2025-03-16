'use client'
import React, { useState } from "react";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { useStepQueries } from "./use_step_queries";
import { useRouteActions } from "./use_route_actions";
import DeleteRouteDialog from "./delete_route_dialog";
import StepDropdown from "./step_dropdown";
import Builder from "@/components/route_builder/list_view/builder";

/**
 * Main Step component that orchestrates the queries and actions
 * related to route steps and provides UI for interacting with them.
 */
export default function Step() {
    const { context, modelId, instanceId } = useInstanceURL();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const routeListViewTriggerRef = React.useRef<HTMLButtonElement>(null);

    // Get route data from queries
    const {
        hasRoute,
        isLoading,
        currentStep,
        targetSteps,
        route
    } = useStepQueries(context, modelId, instanceId);

    // Get route actions
    const {
        handleStepChange,
        handleDeleteRoute,
        deleteRouteMutation
    } = useRouteActions(context, modelId, instanceId, () => setDeleteDialogOpen(false));

    const handleOpenRouteListView = () => {
        routeListViewTriggerRef.current?.click();
    }

    // Return null if not in 'models' context
    if (context !== "models") return null;

    // Return null if hasRoute is false
    if (!isLoading && !hasRoute) return null;

    // Show loading state
    if (isLoading) {
        return <Skeleton className="h-8 w-24" />;
    }

    if (!currentStep) return null;

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
            
            <StepDropdown
                currentStep={currentStep}
                targetSteps={targetSteps}
                onStepChange={handleStepChange}
                onDeleteClick={() => setDeleteDialogOpen(true)}
                onOpenRouteListView={handleOpenRouteListView}
            />
        </>
    );
}