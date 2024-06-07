import { PlusIcon, PointerIcon, Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useDrawingViewerContext } from "./context"

export default function Menu() {
    const { pointer, setPointer } = useDrawingViewerContext()
    return (
        <div className="flex space-x-2 w-full p-2 bg-foreground">
            <Button variant="icon" className={cn("p-2", pointer === "select" ? "bg-black text-white rounded-full" : "")} onClick={() => setPointer("select")}>
                <PointerIcon />
            </Button>
            <Button variant="icon" className={cn("p-2", pointer === "add" ? "bg-black text-white rounded-full" : "")} onClick={() => setPointer("add")}>
                <PlusIcon />
            </Button>
            <Button variant="icon" className={cn("p-2", pointer === "delete" ? "bg-black text-white rounded-full" : "")} onClick={() => setPointer("delete")}>
                <Trash2Icon />
            </Button>
        </div>
    )
}
