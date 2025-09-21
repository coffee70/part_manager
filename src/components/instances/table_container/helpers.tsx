import Label from "@/components/list/data_table/label";
import People from "@/components/ui/people";
import Step from "@/components/list/data_table/step";
import { camelCaseToLabel } from "@/lib/language";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import Links from "@/components/list/data_table/links";
import { Badge } from '@/components/ui/badge';
import KeyValue from "@/components/list/data_table/key_value";
import StepFilter from "@/components/list/filters/filter_step/filter_step";
import ColumnActions from "@/components/list/data_table/column_actions";
import NumberFilter from "@/components/list/filters/filter_number/filter_number";
import UpdatedAtFilter from "@/components/list/filters/filter_updated_at/filter_updated_at";
import LinksFilter from "@/components/list/filters/filter_links/filter_links";
import TextFieldFilter from "@/components/list/filters/filter_text_field/filter_text_field";
import NumberFieldFilter from "@/components/list/filters/filter_number_field/filter_number_field";
import DateFieldFilter from "@/components/list/filters/filter_date_field/filter_date_field";
import TimeFieldFilter from "@/components/list/filters/filter_time_field/filter_time_field";
import SelectFieldFilter from "../../list/filters/filter_select_field/filter_select_field";
import KVFieldFilter from "@/components/list/filters/filter_kv_field/filter_kv_field";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";
import {
    Instance,
    Field,
    systemColumnInformation,
    IntrinsicFieldColumn,
    ModelSystemColumn,
    RouterSystemColumn,
} from "@/types/collections";
import { TableCell, TableHead } from "@/components/ui/table";

type Column = (ModelSystemColumn & { isSystem: true })
    | (RouterSystemColumn & { isSystem: true })
    | (IntrinsicFieldColumn & { isSystem: false })

// Helper function to get system column description
const getSystemColumnDescription = (columnType: string): string => {
    const columnInfo = systemColumnInformation.find(info => info.type === columnType);
    return columnInfo?.description || 'System column';
};

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

const getIntrinsicFieldFilterComponent = (field: Field) => {
    switch (field.type) {
        case 'text':
            return <TextFieldFilter
                fieldId={field._id}
                fieldName={field.name}
            />;
        case 'number':
            return <NumberFieldFilter
                fieldId={field._id}
                fieldName={field.name}
            />;
        case 'date':
            return <DateFieldFilter
                fieldId={field._id}
                fieldName={field.name}
            />;
        case 'time':
            return <TimeFieldFilter
                fieldId={field._id}
                fieldName={field.name}
            />;
        case 'select':
            return <SelectFieldFilter
                fieldId={field._id}
                fieldName={field.name}
                options={field.options || []}
                multiple={field.multiple}
                creative={field.creative}
            />;
        case 'key_value':
            return <KVFieldFilter
                fieldId={field._id}
                fieldName={field.name}
                keys={field.keys || []}
            />;
    }
}

// Helper function to render table header cell
const renderHeaderCell = (column: Column, fields: Field[]) => {
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
                                <TooltipWrapper>
                                    <span>{description}</span>
                                </TooltipWrapper>
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
        const field = fields.find(f => f._id === column.fieldId);
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
                                <TooltipWrapper>
                                    <span>{field.description}</span>
                                </TooltipWrapper>
                            </TooltipContent>
                        </Tooltip>
                    )}
                    <span className="text-xs font-medium">{field.name}</span>
                    <ColumnActions>
                        {getIntrinsicFieldFilterComponent(field)}
                    </ColumnActions>
                </div>
            </TableHead>
        );
    }
};

// Helper function to render table cell
const renderTableCell = (column: Column, instance: Instance, fields: Field[]) => {
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
                        <Step instanceId={instance._id} />
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
        const field = fields.find(f => f._id === column.fieldId);
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
            case 'paragraph':
                return (
                    <TableCell key={column._id}>
                        <div className="text-sm">{value || ''}</div>
                    </TableCell>
                );
            case 'time':
                return (
                    <TableCell key={column._id}>
                        <div className="text-sm">{formatTimeToAmPm(typeof value === 'string' ? value : '') || ''}</div>
                    </TableCell>
                );
            case 'select':
                if (field.multiple && Array.isArray(value)) {
                    return (
                        <TableCell key={column._id}>
                            <div className="flex flex-wrap gap-1">
                                {value.map((option: string) => (
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


// Helper function to convert military time to AM/PM format
const formatTimeToAmPm = (militaryTime: string): string => {
    if (!militaryTime) return '';

    // Handle different time formats that might come in
    const timeMatch = militaryTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!timeMatch) return militaryTime; // Return original if doesn't match expected format

    const hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];

    if (hours < 0 || hours > 23) return militaryTime; // Invalid hour

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${displayHours}:${minutes} ${ampm}`;
};

export {
    type Column,
    getSystemColumnDescription,
    getSystemColumnFilterComponent,
    getIntrinsicFieldFilterComponent,
    renderHeaderCell,
    renderTableCell,
    formatTimeToAmPm,
}