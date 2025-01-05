'use client'
import DataLayout from "@/layouts/data_layout"
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterToolbar, FilterToolbarRow } from "@/components/list/filters/filter_toolbar";
import SearchInput from "@/components/list/filters/search_input";
import Filter from "@/components/list/filters/filter";
import Sort from "@/components/list/sorting/sort";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Label from "@/components/list/data_table/label";
import People from "@/components/ui/people";
import TableSkeleton from "@/components/list/data_table/table_skeleton";
import Priority from "@/components/list/priority/priority";
import { sortKeys } from "@/types/collections";
import DateRangeFilter from "@/components/list/filters/filter_date_range";
import PriorityFilter from "@/components/list/filters/filter_priority";
import New from "@/components/list/new/new";
import DeleteInstance from "@/components/list/data_table/delete_instance";
import { instanceKeys } from "@/lib/query_keys";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { getInstances } from "@/server/instances/get_instances";
import InstanceForm from "./instance_form";

export default function TableContainer() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { modelId } = useInstanceURL();

    const handleClick = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('id', id)
        replace(`${pathname}?${params.toString()}`)
    }

    const { data, isError, isPending } = useQuery({
        queryKey: instanceKeys.all(modelId),
        queryFn: () => getInstances({ modelId, searchParams }),
    })

    if (isPending) return <TableSkeleton />

    if (isError) return <div>Error...</div>

    return (
        <DataLayout>
            <FilterToolbar>
                <FilterToolbarRow>
                    <InstanceForm>
                        <New />
                    </InstanceForm>
                    <SearchInput />
                    <Filter labels={['Updated At', 'Priority']}>
                        <DateRangeFilter paramKey="updatedAt" />
                        <PriorityFilter />
                    </Filter>
                    <Sort keys={sortKeys} />
                </FilterToolbarRow>
            </FilterToolbar>
            <Table>
                <TableBody>
                    {data.map((order) => (
                        <TableRow key={order._id} onClick={() => handleClick(order._id)}>
                            <TableCell className="px-1">
                                <Priority priority={order.priority} />
                            </TableCell>
                            <TableCell>
                                <Label label={order.number} />
                            </TableCell>
                            <TableCell align="right">
                                {/* <StatusBadge label={order.status.label} color={order.status.color} /> */}
                            </TableCell>
                            <TableCell>
                                <People name={order.updatedBy} at={order.updatedAt} iconPosition="right" />
                            </TableCell>
                            <TableCell>
                                <DeleteInstance id={order._id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DataLayout>
    )
}