import PriorityFilter from "@/components/list/filters/filter_priority/filter_priority";
import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { renderHeaderCell } from "./helpers";
import useTable from "./table.hook";

export default function InstancesTableHeader() {

    const { 
        hasPriority, 
        sortedColumns, 
        fields,
    } = useTable();

    return (
        <TableHeader>
            <TableRow>
                {/* priority column header */}
                {hasPriority && <TableHead className="h-8">
                    <div className="flex items-center gap-1">
                        <PriorityFilter />
                    </div>
                </TableHead>}
                {sortedColumns.map((column) => renderHeaderCell(column, fields))}
                <TableHead className="h-8 w-12">
                    {/* Actions column header */}
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}