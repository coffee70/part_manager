import { Skeleton } from "@/components/ui/skeleton"
import DataLayout from "@/layouts/data_layout"
import { Toolbar, ToolbarRow } from "./toolbar"

export default function TableSkeleton() {
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