import { PlusIcon } from "lucide-react"

export default function AddRow({ label }: { label: string }) {
    return (
        <button className="flex items-center px-2 space-x-2 text-text w-full h-10 mt-1 hover:bg-foreground">
            <PlusIcon />
            <span>{`Add ${label}`}</span>
        </button>
    )
}