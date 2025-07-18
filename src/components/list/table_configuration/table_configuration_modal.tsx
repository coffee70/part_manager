'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { systemColumnInformation } from '@/types/collections';
import Loader from '@/components/ui/loader';
import LinksColumnForm from './table_configuration_links_form';
import { TableHeaderPreview } from './table_header_preview';
import { AvailableColumnsList } from './available_columns_list';
import { useTableConfiguration } from './hooks/use_table_configuration';
import { useColumnManagement } from './hooks/use_column_management';
import { useDragAndDrop } from './hooks/use_drag_and_drop';
import { getCombinedColumns } from './column_management_utils';

type Props = {
    children: React.ReactNode;
};

export default function TableConfigurationModal({ children }: Props) {
    const [open, setOpen] = React.useState(false);
    const [focusedColumn, setFocusedColumn] = React.useState<string | null>(null);

    // Use extracted hooks for business logic
    const {
        formState,
        updateFormState,
        intrinsicFields,
        availableContexts,
        isLoading,
        handleSave: handleSaveConfig,
        savePending,
        saveError,
        context
    } = useTableConfiguration(open);

    const handleColumnFocus = (columnId: string | null) => {
        setFocusedColumn(columnId);
    };

    const {
        removeColumn,
        addSystemColumn,
        addFieldColumn,
        updateLinksColumn
    } = useColumnManagement(formState, updateFormState, handleColumnFocus, focusedColumn);

    const {
        activeColumn,
        dragPosition,
        handleDragStart,
        handleDragMove,
        handleDragEnd
    } = useDragAndDrop(formState, updateFormState, handleColumnFocus, focusedColumn);

    // Get combined columns for rendering
    const allColumns = getCombinedColumns(formState);

    const handleSave = () => {
        handleSaveConfig();
        setOpen(false);
    };

    // Find the focused links column for the form
    const focusedLinksColumn = focusedColumn 
        ? formState.systemColumns.find(col => 
            col._id === focusedColumn && 
            'column' in col && 
            col.column === 'links' &&
            'contextIds' in col &&
            'maxLinksPerContext' in col
        )
        : null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[800px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Table Configuration</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Configure the columns displayed in the table
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                {saveError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {saveError instanceof Error ? saveError.message : 'Failed to save configuration'}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex-1 overflow-y-auto space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <TableHeaderPreview
                                allColumns={allColumns}
                                intrinsicFields={intrinsicFields}
                                systemColumnInfo={systemColumnInformation}
                                focusedColumn={focusedColumn}
                                onColumnFocus={handleColumnFocus}
                                onRemoveColumn={removeColumn}
                                onDragStart={handleDragStart}
                                onDragMove={handleDragMove}
                                onDragEnd={handleDragEnd}
                                activeColumn={activeColumn}
                                dragPosition={dragPosition}
                            />

                            {focusedLinksColumn && (
                                <LinksColumnForm
                                    linksColumn={focusedLinksColumn as any}
                                    availableContexts={availableContexts}
                                    onUpdate={updateLinksColumn}
                                />
                            )}

                            <AvailableColumnsList
                                formState={formState}
                                intrinsicFields={intrinsicFields}
                                systemColumnInfo={systemColumnInformation}
                                context={context as 'models' | 'routers'}
                                onAddSystemColumn={addSystemColumn}
                                onAddFieldColumn={addFieldColumn}
                            />

                            {/* Remove CustomDragPreview from here since it's now in TableHeaderPreview */}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={savePending || isLoading}
                        className="w-full"
                    >
                        {savePending ? <Loader /> : 'Save Configuration'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 