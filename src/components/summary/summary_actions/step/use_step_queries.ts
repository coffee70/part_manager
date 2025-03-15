'use client'
import { useQuery } from "@tanstack/react-query";
import { routeKeys } from "@/lib/query_keys";
import { hasRoute } from "@/server/routes/has_route";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { getTargetSteps } from "@/server/routes/get_target_steps";

/**
 * Custom hook to handle all queries related to the Step component
 */
export function useStepQueries(context: string, modelId: string, instanceId: string | null) {
  // Check if context is 'models' and the instance has a route
  const hasRouteQuery = useQuery({
    queryKey: routeKeys.hasRoute(modelId, instanceId),
    queryFn: () => hasRoute({ modelId, instanceId }),
    enabled: context === "models" && !!modelId && !!instanceId,
  });

  // Fetch the current step data only if the instance has a route
  const currentStepQuery = useQuery({
    queryKey: routeKeys.currentStep(modelId, instanceId),
    queryFn: () => getCurrentStep({ modelId, instanceId }),
    enabled: context === "models" && !!modelId && !!instanceId && !!hasRouteQuery.data,
  });

  // Fetch possible target steps
  const targetStepsQuery = useQuery({
    queryKey: routeKeys.targetSteps(modelId, instanceId),
    queryFn: () => getTargetSteps({ modelId, instanceId }),
    enabled: context === "models" && !!modelId && !!instanceId && !!hasRouteQuery.data,
  });

  // Combined loading state
  const isLoading = hasRouteQuery.isLoading || currentStepQuery.isLoading || targetStepsQuery.isLoading;

  return {
    hasRoute: hasRouteQuery.data,
    isLoadingHasRoute: hasRouteQuery.isLoading,
    currentStep: currentStepQuery.data,
    isLoadingCurrentStep: currentStepQuery.isLoading,
    targetSteps: targetStepsQuery.data || [],
    isLoadingTargetSteps: targetStepsQuery.isLoading,
    isLoading,
  };
} 