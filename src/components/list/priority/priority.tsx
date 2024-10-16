import { priorities, type Priority } from "@/types/collections";

export default function Priority({ priority }: { priority: Priority }) {
    const priorityInfo = priorities.find(priorityInfo  => priorityInfo.label === priority)
    if (!priorityInfo) return null
    return (
        <div className="w-1 h-14 rounded-full" style={{ backgroundColor: priorityInfo.color }} />
    )
}