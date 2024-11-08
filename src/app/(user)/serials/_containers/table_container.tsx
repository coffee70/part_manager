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
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { More } from "@/components/ui/more";
import TableSkeleton from "@/components/list/data_table/table_skeleton";
import { collectionKeys } from "@/lib/query_keys";
import { sortKeys } from "@/types/collections";
import DateRangeFilter from "@/components/list/filters/filter_date_range";
import { getSerials } from "@/server/serials/get_serials";
import PriorityFilter from "@/components/list/filters/filter_priority";
import Priority from "@/components/list/priority/priority";
import NewSerial from "@/app/(user)/serials/_forms/new_serial";

export default function TableContainer() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const handleClick = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('id', id)
        replace(`${pathname}?${params.toString()}`)
    }

    // queries
    const {
        data,
        isError,
        isPending
    } = useQuery({
        queryKey: collectionKeys.all('serials'),
        queryFn: () => getSerials({ searchParams }),
    })

    if (isPending) return <TableSkeleton />

    if (isError) return <div>Error...</div>

    return (
        <DataLayout>
            <FilterToolbar>
                <FilterToolbarRow>
                    <NewSerial />
                    <SearchInput />
                    <Filter labels={['Updated At', 'Priority']}>
                        <DateRangeFilter paramKey="updatedAt"/>
                        <PriorityFilter />
                    </Filter>
                    <Sort keys={sortKeys.serials}/>
                </FilterToolbarRow>
            </FilterToolbar>
            <Table>
                <TableBody>
                    {data.map((serial) => (
                        <TableRow key={serial._id} onClick={() => handleClick(serial._id)}>
                            <TableCell className="px-1">
                                <Priority priority={serial.priority} />
                            </TableCell>
                            <TableCell>
                                <Label label={serial.number} />
                            </TableCell>
                            <TableCell align="right">
                                {/* <StatusBadge label={order.status.label} color={order.status.color} /> */}
                            </TableCell>
                            <TableCell>
                                <People name={serial.updatedBy} at={serial.updatedAt} iconPosition="right" />
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <More />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DataLayout>
    )
}