import { cn } from "@/lib/utils"

function RouteTable({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("", className)}>{children}</div>
}

function RouteTableBody({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("flex flex-col gap-6", className)}>{children}</div>
}

function RouteTableRow({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("flex items-center justify-between p-4 border border-stone-300 bg-stone-50 rounded-lg shadow-sm", className)}>{children}</div>
}

function RouteTableCell({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("", className)}>{children}</div>
}

RouteTable.Body = RouteTableBody;
RouteTable.Row = RouteTableRow;
RouteTable.Cell = RouteTableCell;

export default RouteTable;