'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getRouters } from '@/server/routers/get_routers';
import { routerKeys, instanceKeys } from '@/lib/query_keys';
import { getInstances } from '@/server/instances/get_instances';
import { RouteRow } from './types';
import RouterSelector from './router_selector';
import RouteSteps from './route_steps';

type Props = {
  children?: React.ReactNode;
};

export default function Builder({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedRouterId, setSelectedRouterId] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<RouteRow[]>([{ 
    id: crypto.randomUUID(), 
    routerId: '', 
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
    queryKey: instanceKeys.all('routers', selectedRouterId || ''),
    queryFn: () => getInstances({ id: selectedRouterId || '' }),
    enabled: !!selectedRouterId && open
  });

  const handleRouterSelect = (routerId: string) => {
    setSelectedRouterId(routerId);
    setRows(rows => rows.map(row => ({ ...row, routerId, instanceId: '' })));
  };

  const handleSubmit = () => {
    // Here you would handle form submission
    console.log('Creating route with rows:', rows);
  };

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
            selectedRouterId={selectedRouterId} 
            onRouterSelect={handleRouterSelect} 
          />

          <RouteSteps 
            rows={rows} 
            instances={instances} 
            selectedRouterId={selectedRouterId} 
            onRowsChange={setRows} 
          />

          <Button 
            type="submit" 
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedRouterId || rows.some(row => !row.instanceId)}
          >
            Create Route
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 