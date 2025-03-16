'use client'
import React from 'react';
import { Instance, Node } from './types';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, GripVertical, Trash } from 'lucide-react';

type SortableRowProps = {
  row: Node;
  instances: Instance[];
  index: number;
  totalRows: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, instanceId: string) => void;
};

export default function SortableRow({ row, instances, index, totalRows, onRemove, onUpdate }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: row.id,
    animateLayoutChanges: () => false, // Disable layout animations for performance
  });

  const style = {
    transform: CSS.Translate.toString(transform), // Use Translate instead of Transform for better performance
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
    opacity: isDragging ? 0.8 : 1,
  };
  
  // Instance dropdown trigger ref and width
  const instanceTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [instanceTriggerWidth, setInstanceTriggerWidth] = React.useState(0);
  
  // Update instance trigger width when the dropdown is opened
  const handleInstanceDropdownOpen = (open: boolean) => {
    if (open && instanceTriggerRef.current) {
      setInstanceTriggerWidth(instanceTriggerRef.current.offsetWidth);
    }
  };

  // Determine if this row is part of an edge
  const isPartOfEdge = () => {
    return row.instanceId !== '';
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "flex items-center gap-2 p-2 bg-white border border-stone-200 rounded-md shadow-sm transition-colors duration-200",
        isDragging ? "shadow-md" : "hover:shadow",
        isPartOfEdge() ? "border-l-4 border-l-stone-400" : ""
      )}
    >
      <div 
        className="cursor-grab p-1 rounded-md hover:bg-stone-100 transition-colors duration-200" 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-stone-400" />
      </div>

      <div className="flex-1">
        <DropdownMenu onOpenChange={handleInstanceDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              ref={instanceTriggerRef}
              variant="outline" 
              className="w-full justify-between border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-normal transition-colors duration-200"
            >
              {instances.find(i => i._id === row.instanceId)?.number || 'Select an instance'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            style={{ width: `${instanceTriggerWidth}px` }}
            className="border-stone-200 shadow-sm" 
            align="start"
          >
            {instances.map(instance => (
              <DropdownMenuItem 
                key={instance._id} 
                onClick={() => onUpdate(row.id, instance._id)}
                className="text-stone-700 hover:bg-stone-50"
              >
                {instance.number}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(row.id)}
        className={cn("text-stone-400 hover:text-red-500 hover:bg-transparent")}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
} 