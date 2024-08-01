import { Skeleton } from "@/components/ui/skeleton"
export default function TableSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
                <Skeleton className="grow h-10" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
    )
}