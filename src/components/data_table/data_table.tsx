import { TData } from "@/api/orderData";
import Badge from "../ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "../ui/table"
import Label from "./label";
import People from "../ui/people";
import { More } from "../ui/more";
import AddRow from "./add_row";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

type DataTableProps = {
    data: TData;
    archived?: boolean;
}

export function DataTable({ data, archived }: DataTableProps) {
    return (
        <>
            <Table addSlot={!archived ? <AddRow label="Order" /> : undefined}>
                <TableBody>
                    {data.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <Label label={order.label} subLabel={order.sublabel} />
                            </TableCell>
                            <TableCell align="right">
                                <Badge label={order.status.label} color={order.status.color} />
                            </TableCell>
                            <TableCell>
                                <People name={order.updated.by} at={order.updated.at} />
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
        </>
    )
}

