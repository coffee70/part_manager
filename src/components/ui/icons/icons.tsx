import { cn } from "@/lib/utils";
import {
    AlignLeftIcon,
    BoxesIcon,
    UserIcon as LucideUserIcon,
    RouteIcon as LucideRouteIcon
} from "lucide-react"

type Props = {
    size?: number;
    selected?: boolean;
}

export function ModelIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "bg-rose-600 p-1 rounded-md text-white ring-rose-600 ring-offset-2 ring-offset-foreground group-hover:ring-2",
                selected ? "ring-2" : ""
            )}
        >
            <BoxesIcon size={size} />
        </div>
    )
}

export function FieldIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "bg-sky-600 p-1 rounded-md text-white ring-sky-600 ring-offset-2 ring-offset-foreground group-hover:ring-2",
                selected ? "ring-2" : ""
            )}
        >
            <AlignLeftIcon size={size} />
        </div>
    )
}

export function RouteIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "bg-violet-600 p-1 rounded-md text-white ring-violet-600 ring-offset-2 ring-offset-foreground group-hover:ring-2",
                selected ? "ring-2" : ""
            )}
        >
            <LucideRouteIcon size={size} />
        </div>
    )
}

export function UserIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "bg-lime-600 p-1 rounded-md text-white ring-lime-600 ring-offset-2 ring-offset-foreground group-hover:ring-2",
                selected ? "ring-2" : ""
            )}
        >
            <LucideUserIcon size={size} />
        </div>
    )
}