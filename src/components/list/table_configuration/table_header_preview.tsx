import { createPortal } from 'react-dom';
import { DndContext, DragEndEvent, PointerSensor, MouseSensor, closestCenter, useSensor, useSensors, DragStartEvent, DragMoveEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { Field } from '@/types/collections';
import { SortableColumnItem } from './sortable_column_item';
import { CustomDragPreview } from './drag_preview';

type TableHeaderPreviewProps = {
    allColumns: any[];
    intrinsicFields: Field[];
    systemColumnInfo: Array<{ type: string; description: string; }>;
    focusedColumn: string | null;
    onColumnFocus: (columnId: string | null) => void;
    onRemoveColumn: (columnId: string) => void;
    onDragStart: (event: DragStartEvent) => void;
    onDragMove: (event: DragMoveEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    // Add props for drag preview
    activeColumn: any;
    dragPosition: { x: number; y: number } | null;
};

export function TableHeaderPreview({
    allColumns,
    intrinsicFields,
    systemColumnInfo,
    focusedColumn,
    onColumnFocus,
    onRemoveColumn,
    onDragStart,
    onDragMove,
    onDragEnd,
    activeColumn,
    dragPosition
}: TableHeaderPreviewProps) {
    // Optimized sensors with better performance settings
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5, // Reduced from 8px for more responsive feel
            },
        }),
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Reduced from 8px for more responsive feel
            },
        })
    );

    return (
        <div>
            <h3 className="text-lg font-medium mb-4">Table Header Layout</h3>
            <div className="border border-subtle rounded-lg p-4 min-h-[160px] bg-surface-contrast">
                <div className="flex items-center gap-2 text-sm text-text mb-3">
                    <GripVertical className="h-4 w-4" />
                    <span>Drag columns left or right to reorder them in the table header</span>
                </div>
                {allColumns.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-weak border-2 border-dashed border-subtle rounded-lg bg-background">
                        <div className="text-center">
                            <div className="text-lg mb-2">No columns selected</div>
                            <div className="text-sm">Add columns from the available options below</div>
                        </div>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={onDragStart}
                        onDragMove={onDragMove}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={allColumns.map(col => col._id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="relative">
                                {/* Table header simulation with horizontal scroll */}
                                <div className="border border-subtle rounded-lg bg-background shadow-sm">
                                    {/* Scrollable container with max width */}
                                    <div className="max-w-[1000px] overflow-x-auto p-2">
                                        <div className="flex gap-2 min-h-[120px] items-start" style={{ minWidth: `${allColumns.length * 200}px` }}>
                                            {allColumns.map((column) => (
                                                <SortableColumnItem
                                                    key={column._id}
                                                    column={column}
                                                    intrinsicFields={intrinsicFields}
                                                    systemColumnInfo={systemColumnInfo}
                                                    isFocused={focusedColumn === column._id}
                                                    onFocus={() => onColumnFocus(focusedColumn === column._id ? null : column._id)}
                                                    onRemove={() => onRemoveColumn(column._id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Visual hint for table */}
                                <div className="mt-2 text-xs text-weak text-center">
                                    ↑ Table Header Preview {allColumns.length > 3 && <span className="text-text">(scroll horizontally to see all columns)</span>}
                                </div>
                            </div>
                        </SortableContext>
                        
                        {/* Move CustomDragPreview inside DndContext */}
                        {createPortal(<CustomDragPreview
                            column={activeColumn}
                            intrinsicFields={intrinsicFields}
                            systemColumnInfo={systemColumnInfo}
                            position={dragPosition}
                            isFocused={focusedColumn === activeColumn?._id}
                        />, document.body)}
                    </DndContext>
                )}
            </div>
        </div>
    );
} 