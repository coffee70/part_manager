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
import { collectionKeys } from "@/lib/query_keys";
import Priority from "@/components/list/priority/priority";
import { sortKeys } from "@/types/collections";
import DateRangeFilter from "@/components/list/filters/filter_date_range";
import PriorityFilter from "@/components/list/filters/filter_priority";
import { getShopOrders } from "@/server/shop_orders/get_shop_orders";
import ShopOrderForm from '@/app/(user)/shop-orders/_forms/shop_order_form';
import New from "@/components/list/new/new";
import DeleteModel from "@/components/list/delete_model";

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
        queryKey: collectionKeys.all('shopOrders'),
        queryFn: () => getShopOrders({ searchParams }),
    })

    if (isPending) return <TableSkeleton />

    if (isError) return <div>Error...</div>

    return (
        <DataLayout>
            <FilterToolbar>
                <FilterToolbarRow>
                    <ShopOrderForm>
                        <New />
                    </ShopOrderForm>
                    <SearchInput />
                    <Filter labels={['Updated At', 'Priority']}>
                        <DateRangeFilter paramKey="updatedAt" />
                        <PriorityFilter />
                    </Filter>
                    <Sort keys={sortKeys.shopOrders} />
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
                                <DeleteModel id={order._id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DataLayout>
    )
}