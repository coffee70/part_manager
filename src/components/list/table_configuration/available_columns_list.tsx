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
import { contextKeys } from '@/lib/query_keys';
import { useQuery } from '@tanstack/react-query';
import { getContext } from '@/server/contexts/get_context';
import { useInstanceURL } from '@/hooks/url_metadata.hook';

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
    const { id } = useInstanceURL();

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({ context, id }),
    })

    const availableSystemColumns = systemColumnInfo.filter(info => {
        // Filter out step for routers
        if (context === 'routers' && info.type === 'step') return false;
        // Filter out links if the context is not linkable
        if (info.type === 'links' && !contextImpl?.linkable) return false;
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
                    <h4 className="font-medium text-text">
                        System Columns
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {availableSystemColumns.map(info => (
                            <Button
                                key={info.type}
                                variant="outline"
                                onClick={() => onAddSystemColumn(info.type)}
                                className="w-full h-auto min-h-[60px] p-3 justify-start items-start bg-surface-contrast text-text border-subtle interactive-subtle"
                                data-testid='table-configuration-available-system-column-button'
                            >
                                <Plus className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 icon-muted" />
                                <div className="text-left flex-1 min-w-0">
                                    <div className="font-medium text-text mb-1 leading-tight">{info.type}</div>
                                    <div className="text-xs text-text-secondary leading-relaxed whitespace-normal break-words">{info.description}</div>
                                </div>
                            </Button>
                        ))}
                        {availableSystemColumns.length === 0 && (
                            <div className="text-sm text-weak py-3 text-center border border-dashed rounded">
                                All system columns added
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="font-medium text-text">
                        Field Columns
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {availableFields.map(field => (
                            <Button
                                key={field._id}
                                variant="outline"
                                onClick={() => onAddFieldColumn(field._id)}
                                className="w-full h-auto min-h-[60px] p-3 justify-start items-start bg-surface-contrast text-text border-subtle interactive-subtle"
                                data-testid='table-configuration-available-field-column-button'
                            >
                                <Plus className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 icon-muted" />
                                <div className="text-left flex-1 min-w-0">
                                    <div className="font-medium text-text mb-1 leading-tight">{field.name}</div>
                                    {field.description && (
                                        <div className="text-xs text-text-secondary leading-relaxed mb-1 whitespace-normal break-words">{field.description}</div>
                                    )}
                                    <div className="text-xs bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700 px-2 py-0.5 rounded-full inline-block">{snakeCaseToLabel(field.type)}</div>
                                </div>
                            </Button>
                        ))}
                        {availableFields.length === 0 && (
                            <div className="text-sm text-weak py-3 text-center border border-dashed rounded">
                                All fields added
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 