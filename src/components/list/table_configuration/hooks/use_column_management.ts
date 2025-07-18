import { 
    TableConfigurationState, 
    removeColumnFromState, 
    addSystemColumnToState, 
    addFieldColumnToState 
} from '../column_management_utils';

export const useColumnManagement = (
    formState: TableConfigurationState,
    updateFormState: (config: TableConfigurationState) => void,
    onColumnFocus?: (columnId: string | null) => void,
    focusedColumn?: string | null
) => {
    const removeColumn = (columnId: string) => {
        const updatedState = removeColumnFromState(formState, columnId);
        updateFormState(updatedState);

        // Clear focus if the removed column was focused
        if (focusedColumn === columnId && onColumnFocus) {
            onColumnFocus(null);
        }
    };

    const addSystemColumn = (columnType: string) => {
        const updatedState = addSystemColumnToState(formState, columnType);
        updateFormState(updatedState);
    };

    const addFieldColumn = (fieldId: string) => {
        const updatedState = addFieldColumnToState(formState, fieldId);
        updateFormState(updatedState);
    };

    const updateLinksColumn = (updatedColumn: any) => {
        const updatedSystemColumns = formState.systemColumns.map(col =>
            col._id === updatedColumn._id ? updatedColumn : col
        );
        updateFormState({
            ...formState,
            systemColumns: updatedSystemColumns
        });
    };

    return {
        removeColumn,
        addSystemColumn,
        addFieldColumn,
        updateLinksColumn
    };
}; 