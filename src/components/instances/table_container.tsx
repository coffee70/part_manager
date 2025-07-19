'use client'
import DataLayout from "@/layouts/data_layout"
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterToolbar, FilterToolbarRow } from "@/components/list/filters/filter_toolbar";
import SearchInput from "@/components/list/filters/search_input";
import Filter from "@/components/list/filters/filter";
import Sort from "@/components/list/sorting/sort";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import Label from "@/components/list/data_table/label";
import People from "@/components/ui/people";
import TableSkeleton from "@/components/list/data_table/table_skeleton";
import Priority from "@/components/list/priority/priority";
import { sortKeys, systemColumnInformation, Field } from "@/types/collections";
import DateRangeFilter from "@/components/list/filters/filter_date_range";
import PriorityFilter from "@/components/list/filters/filter_priority";
import New from "@/components/list/new/new";
import DeleteInstance from "@/components/list/data_table/delete_instance";
import { instanceKeys, contextKeys, sectionKeys, tableConfigurationKeys } from "@/lib/query_keys";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { getInstances } from "@/server/instances/get_instances";
import InstanceForm from "./instance_form";
import { getContext } from "@/server/contexts/get_context";
import Step from "../list/data_table/step";
import StepFilter from "@/components/list/filters/filter_step";
import TableConfiguration from "../list/table_configuration/table_configuration";
import TableConfigurationModal from "../list/table_configuration/table_configuration_modal";
import { getTableConfiguration } from "@/server/configuration/get_table_configuration";
import { camelCaseToLabel } from "@/lib/language";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import React from "react";
import { getFieldsByContextId } from "@/server/fields/get_fields_by_context_id";

export default function TableContainer() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { context, id, instanceId } = useInstanceURL();

    const handleClick = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('id', id)
        replace(`${pathname}?${params.toString()}`)
    }

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({ context, id }),
    })

    const { data: tableConfiguration } = useQuery({
        queryKey: tableConfigurationKeys.configuration(context, id),
        queryFn: () => getTableConfiguration({ context, contextId: id }),
        enabled: !!context && !!id,
    })

    const { data: allFields = [] } = useQuery({
        queryKey: tableConfigurationKeys.fieldsByContext(context, id),
        queryFn: () => getFieldsByContextId({ context, contextId: id }),
        enabled: !!context && !!id,
    })

    const { data, isError, isPending } = useQuery({
        queryKey: instanceKeys.all(context, id),
        queryFn: () => getInstances({ id, searchParams }),
    })

    // Helper function to get system column description
    const getSystemColumnDescription = (columnType: string): string => {
        const columnInfo = systemColumnInformation.find(info => info.type === columnType);
        return columnInfo?.description || 'System column';
    };

    // Get combined and sorted columns
    const sortedColumns = React.useMemo(() => {
        if (!tableConfiguration) return [];
        
        const allColumns = [
            ...tableConfiguration.systemColumns.map(col => ({ ...col, isSystem: true })),
            ...tableConfiguration.intrinsicFieldColumns.map(col => ({ ...col, isSystem: false }))
        ];
        
        return allColumns.sort((a, b) => a.order - b.order);
    }, [tableConfiguration]);

    // Helper function to render table header cell
    const renderHeaderCell = (column: any) => {
        if (column.isSystem) {
            const columnName = camelCaseToLabel(column.column);
            const description = getSystemColumnDescription(column.column);
            
            return (
                <TableHead key={column._id} className="h-8">
                    <div className="flex items-center gap-1">
                        {description && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InfoIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="bg-stone-800 text-white text-xs px-2 py-1.5 rounded-md shadow-sm">
                                        <span>{description}</span>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <span className="text-xs font-medium">{columnName}</span>
                    </div>
                </TableHead>
            );
        } else {
            const field = allFields.find(f => f._id === column.fieldId);
            if (!field) return <TableHead key={column._id} className="h-8">Unknown Field</TableHead>;
            
            return (
                <TableHead key={column._id} className="h-8">
                    <div className="flex items-center gap-1">
                        {field.description && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InfoIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="bg-stone-800 text-white text-xs px-2 py-1.5 rounded-md shadow-sm">
                                        <span>{field.description}</span>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <span className="text-xs font-medium">{field.name}</span>
                    </div>
                </TableHead>
            );
        }
    };

    // Helper function to render table cell
    const renderTableCell = (column: any, instance: any) => {
        if (column.isSystem) {
            switch (column.column) {
                case 'priority':
                    return (
                        <TableCell key={column._id} className="px-1">
                            <Priority priority={instance.priority} />
                        </TableCell>
                    );
                case 'number':
                    return (
                        <TableCell key={column._id}>
                            <Label label={instance.number} />
                        </TableCell>
                    );
                case 'step':
                    return (
                        <TableCell key={column._id} align="left">
                            {instance.route && (
                                <Step state={instance.route.state} currentStep={instance.route.currentStep} />
                            )}
                        </TableCell>
                    );
                case 'updatedBy':
                    return (
                        <TableCell key={column._id}>
                            <People name={instance.updatedBy} at={instance.updatedAt} iconPosition="right" />
                        </TableCell>
                    );
                case 'links':
                    return (
                        <TableCell key={column._id}>
                            <div className="text-sm text-muted-foreground">Links placeholder</div>
                        </TableCell>
                    );
                default:
                    return (
                        <TableCell key={column._id}>
                            <div className="text-sm text-muted-foreground">Unknown system column</div>
                        </TableCell>
                    );
            }
        } else {
            const field = allFields.find(f => f._id === column.fieldId);
            if (!field) {
                return (
                    <TableCell key={column._id}>
                        <div className="text-sm text-muted-foreground">Unknown field</div>
                    </TableCell>
                );
            }

            // Get the value from instance.values or instance.kv_values
            let value;
            if (field.type === 'key_value') {
                value = instance.kv_values?.[field._id];
            } else {
                value = instance.values?.[field._id];
            }

            // Render based on field type
            switch (field.type) {
                case 'text':
                case 'number':
                case 'date':
                case 'time':
                case 'paragraph':
                    return (
                        <TableCell key={column._id}>
                            <div className="text-sm">{value || ''}</div>
                        </TableCell>
                    );
                case 'select':
                    if (field.multiple && Array.isArray(value)) {
                        return (
                            <TableCell key={column._id}>
                                <div className="text-sm text-muted-foreground">Multi-select placeholder</div>
                            </TableCell>
                        );
                    } else {
                        return (
                            <TableCell key={column._id}>
                                <div className="text-sm">{value || ''}</div>
                            </TableCell>
                        );
                    }
                case 'key_value':
                    return (
                        <TableCell key={column._id}>
                            <div className="text-sm text-muted-foreground">Key-value placeholder</div>
                        </TableCell>
                    );
                default:
                    return (
                        <TableCell key={column._id}>
                            <div className="text-sm text-muted-foreground">Field placeholder</div>
                        </TableCell>
                    );
            }
        }
    };

    if (isPending) return <TableSkeleton />

    if (isError) return <div>Error...</div>

    return (
        <DataLayout>
            <FilterToolbar>
                <FilterToolbarRow>
                    <InstanceForm>
                        <New id={`create-instance-${contextImpl?.name}`} />
                    </InstanceForm>
                    <SearchInput />
                    <Filter labels={['Updated At', 'Priority', 'Step']}>
                        <DateRangeFilter paramKey="updatedAt" />
                        <PriorityFilter />
                        <StepFilter />
                    </Filter>
                    <Sort keys={sortKeys} />
                    <TableConfigurationModal>
                        <TableConfiguration />
                    </TableConfigurationModal>
                </FilterToolbarRow>
            </FilterToolbar>
            <Table>
                <TableHeader>
                    <TableRow>
                        {sortedColumns.map(column => renderHeaderCell(column))}
                        <TableHead className="h-8 w-12">
                            {/* Actions column header */}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((instance) => (
                        <TableRow
                            key={instance._id}
                            onClick={() => handleClick(instance._id)}
                            selected={instanceId === instance._id}
                        >
                            {sortedColumns.map(column => renderTableCell(column, instance))}
                            <TableCell>
                                <DeleteInstance id={instance._id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DataLayout>
    )
}