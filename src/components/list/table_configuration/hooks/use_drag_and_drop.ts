import { useState } from 'react';
import { DragEndEvent, DragStartEvent, DragMoveEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TableConfigurationState, reorderColumns, getCombinedColumns } from '../column_management_utils';

export const useDragAndDrop = (
    formState: TableConfigurationState,
    updateFormState: (config: TableConfigurationState) => void,
    onColumnFocus?: (columnId: string | null) => void,
    focusedColumn?: string | null
) => {
    const [activeColumn, setActiveColumn] = useState<any>(null);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

    const allColumns = getCombinedColumns(formState);

    const handleDragStart = (event: DragStartEvent) => {
        const column = allColumns.find(col => col._id === event.active.id);
        setActiveColumn(column);
    };

    const handleDragMove = (event: DragMoveEvent) => {
        if (activeColumn && event.activatorEvent instanceof MouseEvent) {
            setDragPosition({
                x: event.activatorEvent.clientX,
                y: event.activatorEvent.clientY
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveColumn(null);
        setDragPosition(null);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = allColumns.findIndex(col => col._id === active.id);
        const newIndex = allColumns.findIndex(col => col._id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newColumns = arrayMove(allColumns, oldIndex, newIndex);
            const updatedState = reorderColumns(formState, oldIndex, newIndex, newColumns);
            updateFormState(updatedState);
        }
    };

    return {
        activeColumn,
        dragPosition,
        handleDragStart,
        handleDragMove,
        handleDragEnd
    };
}; 