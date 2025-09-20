import { Skeleton } from "@/components/ui/skeleton"
import DataLayout from "@/layouts/data_layout"
import { Toolbar, ToolbarRow } from "./toolbar"

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