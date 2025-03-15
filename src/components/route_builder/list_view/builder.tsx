'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouters } from '@/server/routers/get_routers';
import { routerKeys, instanceKeys, routeKeys } from '@/lib/query_keys';
import { getInstances } from '@/server/instances/get_instances';
import { RouteFormState, RouteRow, RouteEdge } from './types';
import RouterSelector from './router_selector';
import RouteSteps from './route_steps';
import { upsertInstanceRoute } from '@/server/routes/upsert_instance_route';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useInstanceURL } from '@/hooks/url_metadata.hook';

type Props = {
  children?: React.ReactNode;
};

export default function Builder({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Get modelId and instanceId from URL
  const { id: modelId, instanceId } = useInstanceURL();

  // Initialize with an empty form state
  const [formState, setFormState] = React.useState<RouteFormState>({
    routerId: null,
    route: []
  });
  
  // We still need to maintain rows for the UI representation
  const [rows, setRows] = React.useState<RouteRow[]>([{ 
    id: crypto.randomUUID(), 
    instanceId: '' 
  }]);

  const queryClient = useQueryClient();

  // Get all routers
  const { data: routers = [] } = useQuery({
    queryKey: routerKeys.all(),
    queryFn: () => getRouters(),
    enabled: open
  });

  // Get instances for the selected router
  const { data: instances = [] } = useQuery({
    queryKey: instanceKeys.all('routers', formState.routerId || ''),
    queryFn: () => getInstances({ id: formState.routerId || '' }),
    enabled: !!formState.routerId && open
  });

  // Setup mutation for saving the route
  const { mutate: saveRoute, isPending } = useMutation({
    mutationFn: upsertInstanceRoute,
    onSuccess: (data) => {
      if (data.success) {
        // On success, just close the dialog and invalidate queries
        if (formState.routerId) {
          queryClient.invalidateQueries({ queryKey: instanceKeys.id('models', modelId, instanceId) });
          queryClient.invalidateQueries({ queryKey: instanceKeys.all('models', modelId) });
          queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
          queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
          queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
          queryClient.invalidateQueries({ queryKey: routeKeys.hasRoute(modelId, instanceId) });
        }
        
        // Close dialog
        setOpen(false);
        
        // Reset form
        setFormState({
          routerId: null,
          route: []
        });
        
        setRows([{ 
          id: crypto.randomUUID(), 
          instanceId: '' 
        }]);
        
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

  // Helper function to update form state from rows
  const updateFormStateFromRows = (updatedRows: RouteRow[], previousRows?: RouteRow[]) => {
    // Create edges only between adjacent rows that both have instance values
    const newEdges: RouteEdge[] = [];
    
    // Iterate through rows and only create edges between directly adjacent rows
    for (let i = 0; i < updatedRows.length - 1; i++) {
      const currentRow = updatedRows[i];
      const nextRow = updatedRows[i + 1];
      
      // Only create an edge if both adjacent rows have instances selected
      if (currentRow.instanceId && nextRow.instanceId) {
        newEdges.push({
          id: crypto.randomUUID(),
          sourceId: currentRow.instanceId,
          targetId: nextRow.instanceId
        });
      }
    }
    
    setFormState(prev => ({
      ...prev,
      route: newEdges
    }));
  };

  const handleRouterSelect = (routerId: string) => {
    // Update form state
    setFormState({
      routerId: routerId,
      route: [] // Reset route when router changes
    });
    
    // Reset rows with the new router
    setRows([{ 
      id: crypto.randomUUID(), 
      instanceId: '' 
    }]);
    
    // Clear any errors when router is changed
    setError(null);
  };

  const handleRowsChange = (updatedRows: RouteRow[]) => {
    // Store previous rows for comparison
    const previousRows = [...rows];
    
    // Update the rows
    setRows(updatedRows);
    
    // Check if the rows order or content has changed
    const shouldUpdateFormState = () => {
      // Quick checks first
      // 1. Different number of rows
      if (previousRows.length !== updatedRows.length) return true;
      
      // 2. Different number of rows with non-empty instanceId
      const previousValidRows = previousRows.filter(row => row.instanceId).length;
      const currentValidRows = updatedRows.filter(row => row.instanceId).length;
      if (previousValidRows !== currentValidRows) return true;
      
      // 3. Check if the ordering of instances has changed
      // This will detect drag and drop reordering
      const previousInstanceIds = previousRows
        .filter(row => row.instanceId)
        .map(row => row.instanceId);
      
      const currentInstanceIds = updatedRows
        .filter(row => row.instanceId)
        .map(row => row.instanceId);
      
      // Check if order is different or if any instances changed
      for (let i = 0; i < previousInstanceIds.length; i++) {
        if (previousInstanceIds[i] !== currentInstanceIds[i]) {
          return true;
        }
      }
      
      return false;
    };
    
    // Update form state if needed
    if (shouldUpdateFormState()) {
      updateFormStateFromRows(updatedRows, previousRows);
    }
  };

  const handleSubmit = () => {
    // Validate form state
    if (!modelId) {
      setError('Model ID is missing from URL');
      return;
    }
    
    if (!instanceId) {
      setError('Instance ID is missing from URL');
      return;
    }
    
    if (!formState.routerId) {
      setError('Please select a router');
      return;
    }
    
    // Check if any row has an empty instance selection
    if (!rows.every(row => row.instanceId !== '')) {
      setError('Please select an instance for each row');
      return;
    }
    
    if (formState.route.length === 0) {
      setError('Please create at least one route connection');
      return;
    }
    
    // Submit the formState to the server
    saveRoute({
      modelId,
      instanceId,
      routerId: formState.routerId,
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
  const hasCompleteRoute = formState.route.length > 0;
  const allRowsHaveInstances = rows.every(row => row.instanceId !== '');

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create Route</DialogTitle>
          <DialogDescription>
            <VisuallyHidden.Root>
              Create a new route
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
          <RouterSelector 
            routers={routers} 
            selectedRouterId={formState.routerId} 
            onRouterSelect={handleRouterSelect} 
          />

          <RouteSteps 
            rows={rows} 
            instances={instances} 
            selectedRouterId={formState.routerId}
            onRowsChange={handleRowsChange} 
          />

          <Button 
            type="submit" 
            className="w-full"
            onClick={handleSubmit}
            disabled={!formState.routerId || !hasCompleteRoute || !allRowsHaveInstances || isPending}
          >
            {isPending ? 'Creating...' : 'Create Route'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 