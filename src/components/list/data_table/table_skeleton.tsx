import { Skeleton } from "@/components/ui/skeleton"
import DataLayout from "@/layouts/data_layout"
import { Toolbar, ToolbarRow } from "./toolbar"
import { TableCell, TableRow } from "@/components/ui/table"

const DEFAULT_ROW_COUNT = 6;

// This component shows the entire table container loading (with toolbar)
export default function TableContainerSkeleton() {
    return (
        <DataLayout>
            <Toolbar>
                <ToolbarRow>
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="grow h-10 rounded-md" />
                </ToolbarRow>
            </Toolbar>
            <Skeleton className="h-[500px] w-full rounded-md" />
        </DataLayout>
    )
}

// This component shows just the table portion loading
export function TableSkeleton() {
    return <Skeleton className="h-[500px] w-full rounded-md" />
}

// This component shows just the table body loading
export function TableBodySkeleton({ colspan }: { colspan: number }) {
    return Array.from({ length: DEFAULT_ROW_COUNT }).map((_, index) => (
        <TableRow key={index} className="h-20 hover:bg-transparent">
            {Array.from({ length: colspan }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                    <Skeleton className="h-16 w-full"/>
                </TableCell>
            ))}
        </TableRow>
    ))
}