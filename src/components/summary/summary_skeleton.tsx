import SummaryLayout from "@/layouts/summary_layout";
import { Skeleton } from "../ui/skeleton";
import SummaryToolbar from "./summary_toolbar";

export default function SummarySkeleton() {
    return (
        <SummaryLayout>
            <SummaryTitleSkeleton />
            <SummaryToolbarSkeleton />
            <SummaryNotesSkeleton />
            <SummaryAttachmentsSkeleton />
            <SummaryListSkeleton />
            <SummaryActivitySkeleton />
        </SummaryLayout>
    )
}

function SummaryTitleSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-md" />
            <div className="flex flex-col space-y-2">
                <Skeleton className="w-48 h-6 rounded-md" />
                <Skeleton className="w-36 h-6 rounded-md" />
            </div>
        </div>
    )
}

function SummaryToolbarSkeleton() {
    return (
        <SummaryToolbar>
            <Skeleton className="w-24 h-8 rounded-md" />
            <Skeleton className="w-32 h-8 rounded-md" />
        </SummaryToolbar>
    )
}

function SummaryNotesSkeleton() {
    return (
        <SummaryBaseSkeleton>
            <Skeleton className="w-full h-24 rounded-md" />
        </SummaryBaseSkeleton>
    )
}

function SummaryAttachmentsSkeleton() {
    return (
        <SummaryBaseSkeleton>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                <Skeleton className="w-52 h-40 rounded-md" />
                <Skeleton className="w-52 h-40 rounded-md" />
                <Skeleton className="w-52 h-40 rounded-md" />
            </div>
        </SummaryBaseSkeleton>
    )
}

function SummaryListSkeleton() {
    return (
        <SummaryBaseSkeleton>
            <Skeleton className="w-full h-6 rounded-md" />
            <Skeleton className="w-full h-6 rounded-md" />
            <Skeleton className="w-full h-6 rounded-md" />
        </SummaryBaseSkeleton>
    )
}

function SummaryActivitySkeleton() {
    return (
        <SummaryBaseSkeleton>
            <div className="flex space-x-1">
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-24 h-6" />
            </div>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="flex flex-col space-y-1">
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="flex flex-col space-y-1">
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="flex flex-col space-y-1">
                    <Skeleton className="w-full h-32" />
                </div>
            </div>

        </SummaryBaseSkeleton>
    )
}

function SummaryBaseSkeleton({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex space-x-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <div className="flex flex-col space-y-2 w-full">
                <Skeleton className="w-48 h-7 rounded-md" />
                {children}
            </div>
        </div>
    )
}