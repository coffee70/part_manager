'use client'
import DataLayout from "@/layouts/data_layout"
import { useQuery } from "@tanstack/react-query";
import { getCustomerOrders } from "@/server/customer_orders/get_customer_orders";
import { useSearchParams } from "next/navigation";
import { useRouterHelpers } from "@/lib/search_params";
import useSort from "@/hooks/sort.hook";
import useFilter from "@/hooks/filter.hook";
import { convertSearchParams } from "@/lib/search_params";
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
import { collectionKeys, sectionKeys } from "@/lib/query_keys";
import CustomerOrderForm from "./customer_order_form";
import NewCustomerOrder from "./new_customer_order";

export default function TableContainer() {

    const readOnlySearchParams = useSearchParams()
    const { pushSearchParams } = useRouterHelpers()
    const searchParams = convertSearchParams(readOnlySearchParams)

    // queries
    const { 
        data, 
        isError, 
        isPending 
    } = useQuery({
        queryKey: collectionKeys.all('customerOrders'),
        queryFn: () => getCustomerOrders({ searchParams }),
    })



    // filter and sort
    const search = readOnlySearchParams.get('search') || ''
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        pushSearchParams({ search: e.target.value.length > 0 ? e.target.value : undefined })
    }

    const { filters, setFilters } = useFilter({
        updatedAt: {
            value: { to: undefined, from: undefined },
        },
        statusId: {
            value: []
        }
    })

    const { sort, setSort } = useSort({
        number: {
            label: 'Number',
        },
        updatedAt: {
            label: 'Updated At',
        }
    })

    if (isPending) return <TableSkeleton />

    if (isError) return <div>Error...</div>

    return (
        <DataLayout>
            <FilterToolbar>
                <FilterToolbarRow>
                    <NewCustomerOrder />
                    <SearchInput value={search} onChange={handleSearchChange} />
                    <Filter filters={filters} setFilters={setFilters} />
                    <Sort sort={sort} setSort={setSort} />
                </FilterToolbarRow>
            </FilterToolbar>
            <Table>
                <TableBody>
                    {data.map((order) => (
                        <TableRow key={order._id} onClick={() => pushSearchParams({ id: order._id })}>
                            <TableCell>
                                <Label label={order.number} subLabel={order.customer.name} />
                            </TableCell>
                            <TableCell align="right">
                                {/* <StatusBadge label={order.status.label} color={order.status.color} /> */}
                            </TableCell>
                            <TableCell>
                                <People name={'PLACEHOLDER'} at={order.updatedAt} iconPosition="right" />
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