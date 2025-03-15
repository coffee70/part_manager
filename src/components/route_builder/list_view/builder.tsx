'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getRouters } from '@/server/routers/get_routers';
import { routerKeys, instanceKeys } from '@/lib/query_keys';
import { getInstances } from '@/server/instances/get_instances';
import { RouteFormState, RouteRow, RouteEdge } from './types';
import RouterSelector from './router_selector';
import RouteSteps from './route_steps';

type Props = {
  children?: React.ReactNode;
};

export default function Builder({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  
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
    // Submit the formState which now contains routerId and route edges
    // Process could be added here to send data to the server
  };

  // Check if we have at least one complete edge
  const hasCompleteRoute = formState.route.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            disabled={!formState.routerId || !hasCompleteRoute}
          >
            Create Route
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 