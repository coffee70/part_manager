import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
    ModelTableConfiguration, 
    RouterTableConfiguration, 
    Field,
    Context
} from '@/types/collections';
import { snakeCaseToLabel } from '@/lib/language';

type AvailableColumnsListProps = {
    formState: ModelTableConfiguration | RouterTableConfiguration;
    intrinsicFields: Field[];
    systemColumnInfo: Array<{
        type: string;
        description: string;
    }>;
    context: Exclude<Context, 'users'>;
    onAddSystemColumn: (columnType: string) => void;
    onAddFieldColumn: (fieldId: string) => void;
};

export function AvailableColumnsList({
    formState,
    intrinsicFields,
    systemColumnInfo,
    context,
    onAddSystemColumn,
    onAddFieldColumn
}: AvailableColumnsListProps) {
    const availableSystemColumns = systemColumnInfo.filter(info => {
        // Filter out step for routers
        if (context === 'routers' && info.type === 'step') return false;
        // Filter out already added columns
        return !formState.systemColumns.some(col => col.column === info.type);
    });

    const availableFields = intrinsicFields.filter(field => 
        !formState.intrinsicFieldColumns.some(col => col.fieldId === field._id)
    );

    return (
        <div>
            <h3 className="text-lg font-medium mb-4">Available Columns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h4 className="font-medium text-stone-700">
                        System Columns
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {availableSystemColumns.map(info => (
                            <Button
                                key={info.type}
                                variant="outline"
                                onClick={() => onAddSystemColumn(info.type)}
                                className="w-full h-auto min-h-[60px] p-3 justify-start items-start hover:bg-blue-50 hover:border-blue-300 text-stone-700 border-stone-200"
                            >
                                <Plus className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-stone-600" />
                                <div className="text-left flex-1 min-w-0">
                                    <div className="font-medium text-stone-900 mb-1 leading-tight">{info.type}</div>
                                    <div className="text-xs text-stone-600 leading-relaxed whitespace-normal break-words">{info.description}</div>
                                </div>
                            </Button>
                        ))}
                        {availableSystemColumns.length === 0 && (
                            <div className="text-sm text-stone-500 py-3 text-center border border-dashed rounded">
                                All system columns added
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="font-medium text-stone-700">
                        Field Columns
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {availableFields.map(field => (
                            <Button
                                key={field._id}
                                variant="outline"
                                onClick={() => onAddFieldColumn(field._id)}
                                className="w-full h-auto min-h-[60px] p-3 justify-start items-start hover:bg-green-50 hover:border-green-300 text-stone-700 border-stone-200"
                            >
                                <Plus className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-stone-600" />
                                <div className="text-left flex-1 min-w-0">
                                    <div className="font-medium text-stone-900 mb-1 leading-tight">{field.name}</div>
                                    {field.description && (
                                        <div className="text-xs text-stone-600 leading-relaxed mb-1 whitespace-normal break-words">{field.description}</div>
                                    )}
                                    <div className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block">{snakeCaseToLabel(field.type)}</div>
                                </div>
                            </Button>
                        ))}
                        {availableFields.length === 0 && (
                            <div className="text-sm text-stone-500 py-3 text-center border border-dashed rounded">
                                All fields added
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 