import { cn } from "@/lib/utils"

function RouteTable({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("", className)}>{children}</div>
}

function RouteTableBody({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("flex flex-col gap-6", className)}>{children}</div>
}

function RouteTableRow({ children, className, onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) {
    return <div className={cn("flex items-center justify-between p-4 border border-stone-300 bg-stone-50 rounded-lg shadow-sm cursor-pointer hover:bg-stone-100", className)} onClick={onClick}>{children}</div>
}

function RouteTableHeaderRow({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("flex items-center justify-between px-4 py-2 border border-stone-300 bg-stone-50 rounded-lg shadow-sm", className)}>{children}</div>
}

function RouteTableFooterRow({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("flex items-center justify-between px-4 py-2 border border-stone-300 bg-stone-50 rounded-lg shadow-sm", className)}>{children}</div>
}

function RouteTableCell({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("", className)}>{children}</div>
}

RouteTable.Body = RouteTableBody;
RouteTable.Row = RouteTableRow;
RouteTable.Cell = RouteTableCell;
RouteTable.HeaderRow = RouteTableHeaderRow;
RouteTable.FooterRow = RouteTableFooterRow;
export default RouteTable;