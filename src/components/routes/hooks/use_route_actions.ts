'use client'
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { updateStep } from "@/server/routes/update_step";
import { deleteRoute } from "@/server/routes/delete_route";
import { updateRouteState } from "@/server/routes/update_route_state";
import { RouteState } from "@/types/collections";
import { failStep } from "@/server/routes/fail_step";
import { completeStep } from "@/server/routes/complete_step";
import { startRoute } from "@/server/routes/start_route";
import { stopRoute } from "@/server/routes/stop_route";

const invalidateQueries = (queryClient: QueryClient, modelId: string, instanceId: string | null) => {
  queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
  queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
  queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
  queryClient.invalidateQueries({ queryKey: routeKeys.hasRoute(modelId, instanceId) });
  queryClient.invalidateQueries({ queryKey: routeKeys.currentSteps(modelId) });
  queryClient.invalidateQueries({ queryKey: instanceKeys.id('models', modelId, instanceId) });
  queryClient.invalidateQueries({ queryKey: instanceKeys.all('models', modelId) });
}

/**
 * Custom hook to handle all mutations related to routes
 */
export function useRouteActions(
  context: string,
  modelId: string,
  instanceId: string | null,
) {
  const queryClient = useQueryClient();

  // Mutation for updating the current step
  const updateStepMutation = useMutation({
    mutationFn: updateStep,
    onSuccess: () => {
      if (context === "models" && modelId && instanceId) {
        invalidateQueries(queryClient, modelId, instanceId);
      }
    }
  });

  // Mutation for deleting a route
  const deleteRouteMutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      if (context === "models" && modelId && instanceId) {
        invalidateQueries(queryClient, modelId, instanceId);
      }
    }
  });

  const updateRouteStateMutation = useMutation({
    mutationFn: updateRouteState,
    onSuccess: () => {
      invalidateQueries(queryClient, modelId, instanceId);
    }
  });

  const failStepMutation = useMutation({
    mutationFn: failStep,
    onSuccess: () => {
      invalidateQueries(queryClient, modelId, instanceId);
    }
  });

  const completeStepMutation = useMutation({
    mutationFn: completeStep,
    onSuccess: () => {
      invalidateQueries(queryClient, modelId, instanceId);
    }
  });

  const startRouteMutation = useMutation({
    mutationFn: startRoute,
    onSuccess: () => {
      invalidateQueries(queryClient, modelId, instanceId);
    }
  });

  const stopRouteMutation = useMutation({
    mutationFn: stopRoute,
    onSuccess: () => {
      invalidateQueries(queryClient, modelId, instanceId);
    }
  });

  const handleStepChange = (stepId: string) => {
    if (context === "models" && modelId && instanceId) {
      updateStepMutation.mutate({
        modelId,
        instanceId,
        stepId
      });
    }
  };

  const handleDeleteRoute = () => {
    if (context === "models" && modelId && instanceId) {
      deleteRouteMutation.mutate({
        modelId,
        instanceId
      });
    }
  };

  const handlePauseRoute = () => {
    if (context === "models" && modelId && instanceId) {
      updateRouteStateMutation.mutate({
        modelId,
        instanceId,
        state: RouteState.Paused
      });
    }
  };

  const handleResumeRoute = () => {
    if (context === "models" && modelId && instanceId) {
      updateRouteStateMutation.mutate({
        modelId,
        instanceId,
        state: RouteState.Started
      });
    }
  };

  const handleStartRoute = () => {
    if (context === "models" && modelId && instanceId) {
      startRouteMutation.mutate({
        modelId,
        instanceId,
      });
    }
  };

  const handleStopRoute = () => {
    if (context === "models" && modelId && instanceId) {
      stopRouteMutation.mutate({
        modelId,
        instanceId,
      });
    }
  };

  const handleCompleteRoute = () => {
    if (context === "models" && modelId && instanceId) {
      updateRouteStateMutation.mutate({
        modelId,
        instanceId,
        state: RouteState.Completed
      });
    }
  };

  const handleFailStep = () => {
    if (context === "models" && modelId && instanceId) {
      failStepMutation.mutate({ modelId, instanceId });
    }
  };

  const handleCompleteStep = () => {
    if (context === "models" && modelId && instanceId) {
      completeStepMutation.mutate({ modelId, instanceId });
    }
  };

  return {
    handleStepChange,
    handleDeleteRoute,
    updateStepMutation,
    deleteRouteMutation,
    updateRouteStateMutation,
    handlePauseRoute,
    handleStopRoute,
    handleResumeRoute,
    handleStartRoute,
    handleCompleteRoute,
    handleFailStep,
    handleCompleteStep
  };
} 