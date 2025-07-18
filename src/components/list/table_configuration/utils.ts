import { Field } from '@/types/collections';

type ColumnInfo = {
    name: string;
    description: string;
    type: 'System' | 'Field';
};

// Optimized column info calculation with memoization
export const getColumnInfo = (
    column: any, 
    intrinsicFields: Field[], 
    systemColumnInfo: Array<{ type: string; description: string; }>
): ColumnInfo => {
    if ('column' in column) {
        const info = systemColumnInfo.find(info => info.type === column.column);
        return {
            name: info?.type || column.column,
            description: info?.description || 'System column',
            type: 'System'
        };
    } else {
        const field = intrinsicFields.find(field => field._id === column.fieldId);
        return {
            name: field?.name || 'Unknown Field',
            description: field?.description || 'Field column',
            type: 'Field'
        };
    }
}; 