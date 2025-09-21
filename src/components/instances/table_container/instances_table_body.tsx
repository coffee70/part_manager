import DeleteInstance from "@/components/list/data_table/delete_instance";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { renderTableCell } from "./helpers";
import Priority from "@/components/list/priority/priority";
import useTable from "./table.hook";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TableBodySkeleton } from "@/components/list/data_table/table_skeleton";

export default function InstancesTableBody() {

    const {
        hasPriority,
        sortedColumns,
        fields,
        instances,
        isTableBodyLoading,
        isTableError
    } = useTable();

    const pathname = usePathname();
    const { replace } = useRouter();
    const { instanceId } = useInstanceURL();
    const readOnlySearchParams = useSearchParams();

    const handleClick = (id: string) => {
        const params = new URLSearchParams(readOnlySearchParams);
        params.set('id', id)
        replace(`${pathname}?${params.toString()}`)
    }

    if (isTableError || instances === undefined) return <div>Error...</div>;

    const colspan = sortedColumns.length + (hasPriority ? 1 : 0) + 1;

    if (isTableBodyLoading) return (
        <TableBodySkeleton colspan={colspan} />
    )

    return (
        <TableBody>
            {instances.map((instance) => (
                <TableRow
                    key={instance._id}
                    onClick={() => handleClick(instance._id)}
                    selected={instanceId === instance._id}
                >
                    {/* priority column */}
                    {hasPriority && <TableCell className="px-1">
                        <Priority priority={instance.priority} />
                    </TableCell>}
                    {sortedColumns.map((column) => renderTableCell(column, instance, fields))}
                    <TableCell>
                        <DeleteInstance id={instance._id} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}