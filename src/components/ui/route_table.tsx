'use client'
import { cn } from "@/lib/utils"

function RouteTable({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("", className)}>{children}</div>
}

function RouteTableBody({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div className={cn("flex flex-col gap-6", className)}>{children}</div>
}

function RouteTableRow({ children, className, onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) {
    return <div
        className={cn("flex items-center justify-between p-4 border border-subtle bg-background rounded-lg shadow-sm cursor-pointer hover:bg-hover", className)}
        onClick={onClick}
        data-testid="route-table-row"
    >{children}</div>
}

function RouteTableHeaderRow({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div
        className={cn("flex items-center justify-between px-4 py-2 border border-subtle bg-background rounded-lg shadow-sm", className)}
        data-testid="route-table-header-row"
    >{children}</div>
}

function RouteTableFooterRow({ children, className }: { children?: React.ReactNode, className?: string }) {
    return <div
        className={cn("flex items-center justify-between px-4 py-2 border border-subtle bg-background rounded-lg shadow-sm", className)}
        data-testid="route-table-footer-row"
    >{children}</div>
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