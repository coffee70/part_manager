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
import CustomerForm from '@/app/(user)/customers/_forms/customer_form';
import New from "@/components/list/new/new";
import { getCustomers } from "@/server/customers/get_customers";

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
        queryKey: collectionKeys.all('customers'),
        queryFn: () => getCustomers({ searchParams }),
    })

    if (isPending) return <TableSkeleton />

    if (isError) return <div>Error...</div>

    return (
        <DataLayout>
            <FilterToolbar>
                <FilterToolbarRow>
                    <CustomerForm>
                        <New />
                    </CustomerForm>
                    <SearchInput />
                    <Filter labels={['Updated At']}>
                        <DateRangeFilter paramKey="updatedAt" />
                    </Filter>
                    <Sort keys={sortKeys.customers} />
                </FilterToolbarRow>
            </FilterToolbar>
            <Table>
                <TableBody>
                    {data.map((customer) => (
                        <TableRow key={customer._id} onClick={() => handleClick(customer._id)}>
                            <TableCell className="px-1" />
                            <TableCell>
                                <Label label={customer.name} />
                            </TableCell>
                            <TableCell align="right">
                                {/* <StatusBadge label={order.status.label} color={order.status.color} /> */}
                            </TableCell>
                            <TableCell>
                                <People name={customer.updatedBy} at={customer.updatedAt} iconPosition="right" />
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