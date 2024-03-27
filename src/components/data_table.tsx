import { CircleUserIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import Badge from "./ui/badge";
import { Table, TableBody, TableCell, TableRow } from "./ui/table"
import { Button } from "./ui/button";
import { TData } from "@/api/orderData";


type DataTableProps = {
    data: TData;
    archived: boolean;
}

export function DataTable({ data, archived }: DataTableProps) {
    return (
        <>
            <Table addSlot={ !archived ? <AddRow label="Order" /> : undefined }>
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
                                <UpdatedBy by={order.updated.by} at={order.updated.at} />
                            </TableCell>
                            <TableCell className="w-fit">
                                <More />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

type LabelProps = {
    label: string;
    subLabel?: string;
}

function Label({ label, subLabel }: LabelProps) {
    return (
        <div className="flex flex-col">
            <span className="text-text font-bold">{label}</span>
            <span className="text-sm text-text">{subLabel}</span>
        </div>
    )
}

type UpdatedByProps = {
    by: string;
    at: string;
}

function UpdatedBy({ by, at }: UpdatedByProps) {
    return (
        <div className="flex items-center space-x-2 justify-end">
            <span className="text-sm text-text">{`${formatDate(at)} by ${by}`}</span>
            <CircleUserIcon className="text-text" />
        </div>
    )
}

function More() {
    return (
        <Button variant="table" size="icon">
            <MoreHorizontalIcon />
        </Button>
    )
}

function AddRow({ label }: { label: string }) {
    return (
        <button className="flex items-center px-2 space-x-2 text-text w-full h-10 mt-1 hover:bg-foreground">
            <PlusIcon />
            <span>{`Add ${label}`}</span>
        </button>
    )
}

// formats date to be displayed in the format: "Today", "1d ago", "2mo ago", "1y ago"
function formatDate(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays > 365) {
        const diffYears = Math.floor(diffDays / 365);
        return `${diffYears}y ago`;
    } else if (diffDays > 30) {
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths}mo ago`;
    } else if (diffDays == 1) {
        return 'Yesterday'
    }
    else {
        return `${diffDays}d ago`;
    }
}