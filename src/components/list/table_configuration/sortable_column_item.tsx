import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GripVertical, Trash2, Settings } from 'lucide-react';
import { Field } from '@/types/collections';
import { getColumnInfo } from './utils';

type SortableColumnItemProps = {
    column: any;
    intrinsicFields: Field[];
    systemColumnInfo: Array<{ type: string; description: string; }>;
    isFocused: boolean;
    onFocus: () => void;
    onRemove: () => void;
};

export function SortableColumnItem({ 
    column, 
    intrinsicFields, 
    systemColumnInfo, 
    isFocused, 
    onFocus, 
    onRemove 
}: SortableColumnItemProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: column._id,
        data: {
            type: 'column',
            column
        }
    });

    // Optimized style calculation - only opacity and basic transform when dragging
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition, // Disable transition during drag for better performance
        opacity: isDragging ? 0.2 : 1, // Very low opacity when dragging
    };

    const columnInfo = getColumnInfo(column, intrinsicFields, systemColumnInfo);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                relative flex-shrink-0 w-48 h-36 bg-white border rounded-lg shadow-sm flex flex-col
                ${isDragging ? 'z-0' : 'transition-all hover:shadow-md'}
                ${isFocused && !isDragging ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-stone-200 hover:border-stone-300'}
            `}
        >
            {/* Header section with drag handle and remove button */}
            <div className="flex items-center justify-between p-2 border-b border-stone-200 flex-shrink-0">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-stone-100 touch-none"
                    role="button"
                    aria-label="Drag to reorder column"
                    tabIndex={0}
                >
                    <GripVertical className="h-4 w-4 text-stone-400 hover:text-stone-600" />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            {/* Column content */}
            <div className="p-3 cursor-pointer flex-1 flex flex-col" onClick={onFocus}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm truncate">{columnInfo.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                        columnInfo.type === 'System' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                    }`}>
                        {columnInfo.type}
                    </span>
                    {'column' in column && column.column === 'links' && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                    <Settings className="h-2.5 w-2.5 text-white drop-shadow-sm" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="bg-stone-800 text-white text-xs px-2 py-1.5 rounded-md shadow-sm">
                                    <span>Click to Configure</span>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                
                <div className="text-xs text-stone-500 line-clamp-3">
                    {columnInfo.description}
                </div>
            </div>
        </div>
    );
} 