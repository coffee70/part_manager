'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouters } from '@/server/routers/get_routers';
import { routerKeys, instanceKeys, routeKeys } from '@/lib/query_keys';
import { getInstances } from '@/server/instances/get_instances';
import { RouteFormState, Route } from './types';
import RouterSelector from './router_selector';
import RouteSteps from './route_steps';
import { upsertRouteFromListView } from '@/server/routes/upsert_route_from_list_view';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import Loader from '@/components/ui/loader';

type Props = {
  children?: React.ReactNode;
  route?: Route | null;
};

export default function Builder({ children, route }: Props) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get modelId and instanceId from URL
  const { id: modelId, instanceId } = useInstanceURL();

  // Initialize with an empty form state
  const [formState, setFormState] = React.useState<RouteFormState>({
    route: route || {
      routerId: '',
      currentStepId: '',
      nodes: [],
    }
  });

  // add effect to update form state when route changes
  React.useEffect(() => {
    setFormState({
      route: route || {
        routerId: '',
        currentStepId: '',
        nodes: [],
      }
    });
  }, [route]);

  const queryClient = useQueryClient();

  // Get all routers
  const { data: routers = [] } = useQuery({
    queryKey: routerKeys.all(),
    queryFn: () => getRouters(),
    enabled: open
  });

  // Get instances for the selected router
  const { data: instances = [] } = useQuery({
    queryKey: instanceKeys.all('routers', formState.route.routerId || ''),
    queryFn: () => getInstances({ id: formState.route.routerId || '' }),
    enabled: !!formState.route.routerId && open
  });

  // Setup mutation for saving the route
  const { mutate: saveRoute, isPending } = useMutation({
    mutationFn: upsertRouteFromListView,
    onSuccess: (data) => {
      if (data.success) {
        // On success, just close the dialog and invalidate queries
        queryClient.invalidateQueries({ queryKey: instanceKeys.id('models', modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: instanceKeys.all('models', modelId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
        queryClient.invalidateQueries({ queryKey: routeKeys.hasRoute(modelId, instanceId) });

        // Close dialog
        setOpen(false);

        // Clear any errors
        setError(null);
      } else {
        // Display error message
        setError(data.error || 'Failed to create route');
      }
    },
    onError: (error) => {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleRouterSelect = (routerId: string) => {
    // Update form state
    setFormState({
      route: {
        routerId: routerId,
        currentStepId: '',
        nodes: [],
      }
    });

    // Clear any errors when router is changed
    setError(null);
  };


  const handleSubmit = () => {
    // Submit the formState to the server
    saveRoute({
      modelId,
      instanceId,
      route: formState.route
    });
  };

  // Reset error when dialog is closed
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null);
    }
  };

  // Check if we have at least one complete edge
  // AND make sure all rows have an instance selected

  const title = route ? 'Modify Route' : 'Create Route';
  const description = route ? 'Modify the route for this instance' : 'Create a new route for this instance';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[650px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <VisuallyHidden.Root>
              {description}
            </VisuallyHidden.Root>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="max-h-[70vh] px-1 overflow-y-auto space-y-6">
            <RouterSelector
              routers={routers}
              selectedRouterId={formState.route.routerId}
              onRouterSelect={handleRouterSelect}
            />

            <RouteSteps
              route={formState.route}
              instances={instances}
              selectedRouterId={formState.route.routerId}
              onRouteChange={(route) => setFormState({ ...formState, route })}
            />
          </div>

          <div className="px-1">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit}
              disabled={!formState.route.routerId || isPending}
            >
              {isPending ? <Loader /> : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 