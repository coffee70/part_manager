'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { updateStep } from "@/server/routes/update_step";
import { deleteRoute } from "@/server/routes/delete_route";

/**
 * Custom hook to handle all mutations related to routes
 */
export function useRouteActions(
  context: string,
  modelId: string,
  instanceId: string | null,
  onDeleteSuccess?: () => void
) {
  const queryClient = useQueryClient();

  // Mutation for updating the current step
  const updateStepMutation = useMutation({
    mutationFn: updateStep,
    onSuccess: () => {
      if (context === "models" && modelId && instanceId) {
        queryClient.invalidateQueries({ queryKey: instanceKeys.id("models", modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", modelId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
      }
    }
  });

  // Mutation for deleting a route
  const deleteRouteMutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      if (context === "models" && modelId && instanceId) {
        queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.hasRoute(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: instanceKeys.id('models', modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: instanceKeys.all('models', modelId) });

        // Call success callback if provided
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }
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

  return {
    handleStepChange,
    handleDeleteRoute,
    updateStepMutation,
    deleteRouteMutation
  };
} 