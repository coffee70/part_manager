import { priorityInfo, type Priority } from "@/types/collections";

export default function Priority({ priority }: { priority: Priority }) {
    const info = priorityInfo[priority]
    if (!priorityInfo) return null
    return (
        <div className="w-1 h-14 rounded-full" style={{ backgroundColor: info.color }} />
    )
}