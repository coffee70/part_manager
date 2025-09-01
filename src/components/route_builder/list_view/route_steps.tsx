'use client'
import React from 'react';
import { Route, Instance, Node } from '@/types/collections';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableRow from './sortable_row';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type RouteStepsProps = {
  route: Route;
  instances: Instance[];
  selectedRouterId: string | null;
  onRouteChange: (route: Route) => void;
};

export default function RouteSteps({ route, instances, selectedRouterId, onRouteChange }: RouteStepsProps) {  
  // For drag and drop reordering - use a lower activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Lower distance for easier activation
        tolerance: 5, // Add tolerance for better precision
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Could track active item if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const updatedRows = arrayMove(
        route.nodes,
        route.nodes.findIndex((row) => row.id === active.id),
        route.nodes.findIndex((row) => row.id === over.id)
      );
      
      // Pass the updated rows to parent
      onRouteChange({ ...route, nodes: updatedRows });
    }
  };

  const addRow = () => {
    // Add a new row with empty instanceId
    const updatedRows: Node[] = [
      ...route.nodes, 
      { 
        id: crypto.randomUUID(),
        instanceId: '',
      }
    ];
    
    onRouteChange({ ...route, nodes: updatedRows });
  };

  const removeRow = (id: string) => {
    if (route.nodes.length > 1) {
      const updatedRows = route.nodes.filter(row => row.id !== id);
      // This will trigger parent's handleRowsChange which should update the edges
      onRouteChange({ ...route, nodes: updatedRows });
    }
  };

  const updateRow = (id: string, instanceId: string) => {
    const updatedRows = route.nodes.map(row => 
      row.id === id ? { ...row, instanceId } : row
    );
    
    // This selection change should trigger edge updates in the parent component
    onRouteChange({ ...route, nodes: updatedRows });
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
      <div className="text-sm font-medium text-stone-700 mb-3">Route Steps</div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        autoScroll={{
          enabled: true,
          threshold: {
            x: 0.15,
            y: 0.15
          }
        }}
      >
        <SortableContext items={route.nodes.map(row => row.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {route.nodes.map((row, index) => (
              <SortableRow 
                key={row.id}
                row={row}
                instances={instances}
                index={index}
                totalRows={route.nodes.length}
                onRemove={removeRow}
                onUpdate={updateRow}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button 
        variant="outline" 
        className="w-full mt-3 flex items-center justify-center border-dashed border-stone-300 bg-white hover:bg-stone-100 text-stone-600 transition-colors duration-200"
        onClick={addRow}
        disabled={!selectedRouterId}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Step
      </Button>
    </div>
  );
} 