import { type Order } from "@/types/types";
import { useFilterContext } from "@/context/filters/filter.context";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Label from "@/components/data_table/label";
import People from "@/components/ui/people";
import Badge from "@/components/ui/badge";
import { More } from "@/components/ui/more";
import AddRow from "@/components/data_table/add_row";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
    orders: Order[];
    archived?: boolean;
}

export default function OrderDataTable({ orders, archived }: Props) {
    const { showArchived } = useFilterContext()
    /**
     * If the order table is showing archived (completed) orders and the showArchived
     * filter is not enabled, hide the table.
     */
    const hidden = archived && !showArchived
    if (hidden) return null
    return (
        <div>
            <Table>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <Label label={order.label} subLabel={order.sublabel} />
                            </TableCell>
                            <TableCell align="right">
                                <Badge label={order.status.label} color={order.status.color} />
                            </TableCell>
                            {order.updated && <TableCell>
                                <People name={order.updated.by} at={order.updated.at} />
                            </TableCell>}
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
            {!archived && <AddRow label="Add Order" />}
        </div>
    )
}