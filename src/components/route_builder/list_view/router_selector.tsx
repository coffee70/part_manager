'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Router } from './types';

type RouterSelectorProps = {
  routers: Router[];
  selectedRouterId: string | null;
  onRouterSelect: (routerId: string) => void;
};

export default function RouterSelector({ routers, selectedRouterId, onRouterSelect }: RouterSelectorProps) {
  const routerTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  
  const handleDropdownOpen = (open: boolean) => {
    if (open && routerTriggerRef.current) {
      setTriggerWidth(routerTriggerRef.current.offsetWidth);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text">Router</label>
      <DropdownMenu onOpenChange={handleDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            ref={routerTriggerRef}
            variant="outline" 
            className="w-full justify-between border-subtle bg-surface-contrast hover:bg-hover text-text font-normal transition-colors duration-200"
          >
            {selectedRouterId ? routers.find(r => r._id === selectedRouterId)?.name || 'Select a router' : 'Select a router'}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          style={{ width: `${triggerWidth}px` }}
          className="border-subtle bg-background shadow-sm" 
          align="start"
        >
          {routers.map(router => (
            <DropdownMenuItem 
              key={router._id} 
              onClick={() => onRouterSelect(router._id)}
              className="text-text hover:bg-hover"
            >
              {router.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 