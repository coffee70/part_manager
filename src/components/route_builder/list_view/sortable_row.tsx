'use client'
import React from 'react';
import { Instance, Node } from '@/types/collections';
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
        "flex items-center gap-2 p-2 bg-surface-contrast border border-subtle rounded-md shadow-sm transition-colors duration-200",
        isDragging ? "shadow-md" : "hover:shadow",
        isPartOfEdge() ? "border-l-4 border-l-stone-400" : ""
      )}
    >
      <div 
        className="cursor-grab p-1 rounded-md interactive-subtle transition-colors duration-200" 
        {...attributes} 
        {...listeners}
        data-testid={`drag-handle-${index}`}
      >
        <GripVertical className="h-5 w-5 icon-muted" />
      </div>

      <div className="flex-1">
        <DropdownMenu onOpenChange={handleInstanceDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              ref={instanceTriggerRef}
              variant="outline" 
              className="w-full justify-between border-subtle bg-surface-contrast hover:bg-hover text-text font-normal transition-colors duration-200"
            >
              {instances.find(i => i._id === row.instanceId)?.number || 'Select an instance'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            style={{ width: `${instanceTriggerWidth}px` }}
            className="border-subtle shadow-sm" 
            align="start"
          >
            {instances.map(instance => (
              <DropdownMenuItem 
                key={instance._id} 
                onClick={() => onUpdate(row.id, instance._id)}
                className="text-text hover:bg-hover"
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
        className={cn("icon-muted hover:text-destructive hover:bg-transparent")}
        data-testid={`delete-step-button-${index}`}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
} 