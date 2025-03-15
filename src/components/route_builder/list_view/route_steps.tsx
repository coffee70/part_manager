'use client'
import React from 'react';
import { RouteRow, InstanceType } from './types';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors, DragStartEvent, defaultDropAnimation } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableRow from './sortable_row';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type RouteStepsProps = {
  rows: RouteRow[];
  instances: InstanceType[];
  selectedRouterId: string | null;
  onRowsChange: (rows: RouteRow[]) => void;
};

export default function RouteSteps({ rows, instances, selectedRouterId, onRowsChange }: RouteStepsProps) {  
  // For drag and drop reordering - use a lower activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Lower distance for easier activation
        tolerance: 5, // Add tolerance for better precision
      },
    })
  );


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      onRowsChange(arrayMove(
        rows,
        rows.findIndex((row) => row.id === active.id),
        rows.findIndex((row) => row.id === over.id)
      ));
    }
  };

  const addRow = () => {
    onRowsChange([
      ...rows, 
      { 
        id: crypto.randomUUID(), 
        routerId: selectedRouterId || '', 
        instanceId: '' 
      }
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      onRowsChange(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, routerId: string, instanceId: string) => {
    onRowsChange(rows.map(row => 
      row.id === id ? { ...row, routerId, instanceId } : row
    ));
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
      <div className="text-sm font-medium text-stone-700 mb-3">Route Steps</div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        autoScroll={{
          enabled: true,
          threshold: {
            x: 0.15,
            y: 0.15
          }
        }}
      >
        <SortableContext items={rows.map(row => row.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rows.map((row) => (
              <SortableRow 
                key={row.id}
                row={row}
                instances={instances}
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