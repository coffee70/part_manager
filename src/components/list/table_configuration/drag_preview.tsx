'use client'
import React, { useEffect, useState } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { Field } from '@/types/collections';
import { getColumnInfo } from './utils';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GripVertical, Settings } from 'lucide-react';

type CustomDragPreviewProps = {
    column: any;
    intrinsicFields: Field[];
    systemColumnInfo: Array<{ type: string; description: string; }>;
    position: { x: number; y: number } | null;
    isFocused: boolean;
};

export function CustomDragPreview({ 
    column, 
    intrinsicFields, 
    systemColumnInfo, 
    position, 
    isFocused 
}: CustomDragPreviewProps) {
    const { context } = useInstanceURL();
    
    // Get the proper plural form
    const contextPlural = context === 'models' ? 'models' : 'routers';
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!column || !mounted) {
        return (
            <DragOverlay>
                <div />
            </DragOverlay>
        );
    }

    const columnInfo = getColumnInfo(column, intrinsicFields, systemColumnInfo);

    return (
        <DragOverlay>
            <div className="relative flex-shrink-0 w-48 h-36 bg-white border-2 border-blue-400 rounded-lg shadow-lg opacity-95 transform rotate-2 flex flex-col">
                {/* Header section with drag handle */}
                <div className="flex items-center justify-between p-2 border-b border-stone-200 flex-shrink-0">
                    <div className="cursor-grab p-1 rounded">
                        <GripVertical className="h-4 w-4 text-stone-400" />
                    </div>
                    <div className="w-6 h-6"></div> {/* Placeholder for remove button space */}
                </div>

                {/* Column content */}
                <div className="p-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm truncate">{columnInfo.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 flex-shrink-0">
                            {columnInfo.type}
                        </span>
                        {'column' in column && column.column === 'links' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
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
        </DragOverlay>
    );
} 