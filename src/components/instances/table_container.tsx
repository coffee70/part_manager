'use client'
import DataLayout from "@/layouts/data_layout"
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toolbar, ToolbarRow } from "@/components/list/data_table/toolbar";
import SearchInput from "@/components/list/filters/search_input";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import Label from "@/components/list/data_table/label";
import People from "@/components/ui/people";
import TableSkeleton from "@/components/list/data_table/table_skeleton";
import Priority from "@/components/list/priority/priority";
import {
    Instance,
    IntrinsicFieldColumn,
    ModelSystemColumn,
    RouterSystemColumn,
    systemColumnInformation,
} from "@/types/collections";
import New from "@/components/list/new/new";
import DeleteInstance from "@/components/list/data_table/delete_instance";
import { instanceKeys, contextKeys, tableConfigurationKeys, userKeys } from "@/lib/query_keys";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { getInstances } from "@/server/instances/get_instances";
import InstanceForm from "./instance_form";
import { getContext } from "@/server/contexts/get_context";
import Step from "@/components/list/data_table/step";
import TableConfiguration from "@/components/list/table_configuration/table_configuration";
import TableConfigurationModal from "@/components/list/table_configuration/table_configuration_modal";
import { getTableConfiguration } from "@/server/configuration/get_table_configuration";
import { camelCaseToLabel } from "@/lib/language";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import React from "react";
import { getFieldsByContextId } from "@/server/fields/get_fields_by_context_id";
import Links from "@/components/list/data_table/links";
import { Badge } from '@/components/ui/badge';
import KeyValue from "@/components/list/data_table/key_value";
import { getCurrentUser } from "@/server/auth/get_current_user";
import ShowCompleted from "@/components/list/filters/show_completed/show_completed";
import PriorityFilter from "@/components/list/filters/filter_priority/filter_priority";
import StepFilter from "@/components/list/filters/filter_step/filter_step";
import ColumnActions from "@/components/list/data_table/column_actions";
import NumberFilter from "@/components/list/filters/filter_number/filter_number";
import UpdatedAtFilter from "../list/filters/filter_updated_at/filter_updated_at";
import LinksFilter from "../list/filters/filter_links/filter_links";

type Column = (ModelSystemColumn & { isSystem: true })
    | (RouterSystemColumn & { isSystem: true })
    | (IntrinsicFieldColumn & { isSystem: false })

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

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

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
        queryFn: () => getInstances({ id, context, searchParams }),
    })

    // Helper function to get system column description
    const getSystemColumnDescription = (columnType: string): string => {
        const columnInfo = systemColumnInformation.find(info => info.type === columnType);
        return columnInfo?.description || 'System column';
    };

    const hasPriority = contextImpl && 'priority' in contextImpl && contextImpl.priority;

    // Get combined and sorted columns
    const sortedColumns = React.useMemo(() => {
        if (!tableConfiguration) return [];

        const allColumns: Column[] = [
            ...tableConfiguration.systemColumns.map(col => ({ ...col, isSystem: true as const })),
            ...tableConfiguration.intrinsicFieldColumns.map(col => ({ ...col, isSystem: false as const }))
        ];

        return allColumns.sort((a, b) => a.order - b.order);
    }, [tableConfiguration]);

    const getSystemColumnFilterComponent = (column: Column) => {
        if (column.isSystem) {
            switch (column.column) {
                case 'number':
                    return <NumberFilter />;
                case 'step':
                    return <StepFilter />;
                case 'updatedBy':
                    return <UpdatedAtFilter />;
                case 'links':
                    return <LinksFilter />;
            }
        }
        return null;
    }

    // Helper function to render table header cell
    const renderHeaderCell = (column: Column) => {
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
                        <ColumnActions>
                            {getSystemColumnFilterComponent(column)}
                        </ColumnActions>
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
    const renderTableCell = (column: Column, instance: Instance) => {
        if (column.isSystem) {
            switch (column.column) {
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
                            <Links column={column} links={instance.links} />
                        </TableCell>
                    );
                default:
                    return null;
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

            const kvValue = instance.kv_values?.[field._id];
            const value = instance.values?.[field._id];

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
                                <div className="flex flex-wrap gap-1">
                                    {field.options?.map(option => (
                                        <Badge key={option} label={option} color='gray' className='px-2' />
                                    ))}
                                </div>
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
                            <KeyValue kvValue={kvValue} />
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
            <Toolbar>
                <ToolbarRow>
                    <InstanceForm>
                        <New id={`create-instance-${contextImpl?.name}`} />
                    </InstanceForm>
                    {user?.role === 'admin' && (
                        <TableConfigurationModal>
                            <TableConfiguration />
                        </TableConfigurationModal>
                    )}
                    <SearchInput />
                </ToolbarRow>
                <ToolbarRow>
                    <ShowCompleted />
                </ToolbarRow>
            </Toolbar>
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* priority column header */}
                        {hasPriority && <TableHead className="h-8">
                            <div className="flex items-center gap-1">
                                <PriorityFilter />
                            </div>
                        </TableHead>}
                        {sortedColumns.map((column) => renderHeaderCell(column))}
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
                            {/* priority column */}
                            {hasPriority && <TableCell className="px-1">
                                <Priority priority={instance.priority} />
                            </TableCell>}
                            {sortedColumns.map((column) => renderTableCell(column, instance))}
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