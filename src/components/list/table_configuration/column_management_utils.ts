import { ModelTableConfiguration, RouterTableConfiguration } from '@/types/collections';

export type TableConfigurationState = ModelTableConfiguration | RouterTableConfiguration;

export const generateColumnId = (prefix: string): string => {
    const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 9);
    return `temp-${prefix}-${Date.now()}-${randomPart}`;
};

export const getMaxOrder = (columns: any[]): number => {
    return Math.max(...columns.map(col => col.order), -1);
};

export const createSystemColumn = (columnType: string, order: number) => {
    const newId = generateColumnId(columnType);
    
    if (columnType === 'links') {
        return {
            _id: newId,
            column: 'links' as const,
            contextIds: [],
            maxLinksPerContext: 5,
            order
        };
    }
    
    return {
        _id: newId,
        column: columnType as any,
        order
    };
};

export const createFieldColumn = (fieldId: string, order: number) => {
    const newId = generateColumnId(`field-${fieldId}`);
    
    return {
        _id: newId,
        fieldId,
        order
    };
};

export const removeColumnFromState = (
    state: TableConfigurationState,
    columnId: string
): TableConfigurationState => {
    const newSystemColumns = state.systemColumns.filter(col => col._id !== columnId);
    const newIntrinsicFieldColumns = state.intrinsicFieldColumns.filter(col => col._id !== columnId);

    // Reorder remaining columns
    const allRemaining = [...newSystemColumns, ...newIntrinsicFieldColumns].sort((a, b) => a.order - b.order);
    const reorderedSystemColumns: any[] = [];
    const reorderedIntrinsicFieldColumns: any[] = [];

    allRemaining.forEach((col, index) => {
        const updatedCol = { ...col, order: index };
        if ('column' in updatedCol) {
            reorderedSystemColumns.push(updatedCol);
        } else {
            reorderedIntrinsicFieldColumns.push(updatedCol);
        }
    });

    return {
        ...state,
        systemColumns: reorderedSystemColumns,
        intrinsicFieldColumns: reorderedIntrinsicFieldColumns
    };
};

export const addSystemColumnToState = (
    state: TableConfigurationState,
    columnType: string
): TableConfigurationState => {
    const allColumns = [...state.systemColumns, ...state.intrinsicFieldColumns];
    const newOrder = getMaxOrder(allColumns) + 1;
    const newColumn = createSystemColumn(columnType, newOrder);

    return {
        ...state,
        systemColumns: [...state.systemColumns, newColumn]
    };
};

export const addFieldColumnToState = (
    state: TableConfigurationState,
    fieldId: string
): TableConfigurationState => {
    const allColumns = [...state.systemColumns, ...state.intrinsicFieldColumns];
    const newOrder = getMaxOrder(allColumns) + 1;
    const newColumn = createFieldColumn(fieldId, newOrder);

    return {
        ...state,
        intrinsicFieldColumns: [...state.intrinsicFieldColumns, newColumn]
    };
};

export const reorderColumns = (
    state: TableConfigurationState,
    oldIndex: number,
    newIndex: number,
    allColumns: any[]
): TableConfigurationState => {
    const systemColumns: any[] = [];
    const intrinsicFieldColumns: any[] = [];

    allColumns.forEach((col, index) => {
        const updatedColumn = { ...col, order: index };
        if ('column' in updatedColumn) {
            systemColumns.push(updatedColumn);
        } else {
            intrinsicFieldColumns.push(updatedColumn);
        }
    });

    return {
        ...state,
        systemColumns,
        intrinsicFieldColumns
    };
};

export const getCombinedColumns = (state: TableConfigurationState) => {
    return [
        ...state.systemColumns,
        ...state.intrinsicFieldColumns
    ].sort((a, b) => a.order - b.order);
}; 