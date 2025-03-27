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
import { instanceKeys, contextKeys, routeKeys } from "@/lib/query_keys";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { getInstances } from "@/server/instances/get_instances";
import InstanceForm from "./instance_form";
import { getContext } from "@/server/contexts/get_context";
import { Badge, StepBadge } from "@/components/ui/badge";
import { isStarted } from "@/server/routes/is_started";

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

    const { data, isError, isPending } = useQuery({
        queryKey: instanceKeys.all(context, id),
        queryFn: () => getInstances({ id, searchParams }),
    })

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
                    <Filter labels={['Updated At', 'Priority']}>
                        <DateRangeFilter paramKey="updatedAt" />
                        <PriorityFilter />
                    </Filter>
                    <Sort keys={sortKeys} />
                </FilterToolbarRow>
            </FilterToolbar>
            <Table>
                <TableBody>
                    {data.map((instance) => (
                        <TableRow 
                            key={instance._id} 
                            onClick={() => handleClick(instance._id)}
                            selected={instanceId === instance._id}
                        >
                            {contextImpl && 'priority' in contextImpl && contextImpl.priority && <TableCell className="px-1">
                                <Priority priority={instance.priority} />
                            </TableCell>}
                            <TableCell>
                                <Label label={instance.number} />
                            </TableCell>
                            {!instance.routeIsStarted && instance.step ? (
                                <TableCell align="left">
                                    <Badge label={"NOT STARTED"} className="border border-stone-500 text-stone-500 px-2" />
                                </TableCell>
                            ) : (
                                <TableCell align="left">
                                    {instance.step && <StepBadge step={instance.step} />}
                                </TableCell>
                            )}
                            <TableCell>
                                <People name={instance.updatedBy} at={instance.updatedAt} iconPosition="right" />
                            </TableCell>
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