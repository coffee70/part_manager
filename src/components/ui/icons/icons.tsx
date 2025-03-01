import { cn } from "@/lib/utils";
import {
    AlignLeftIcon,
    BoxesIcon,
    UserIcon as LucideUserIcon,
    RouteIcon as LucideRouteIcon,
    SearchXIcon
} from "lucide-react"

type Props = {
    size?: number;
    selected?: boolean;
}

function TitleModelIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-md",
            )}
        >
            <BoxesIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function PrimaryModelIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md transition-all duration-200",
                selected
                    ? "bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-md"
                    : "text-stone-600 hover:bg-stone-200"
            )}
        >
            <BoxesIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function SecondaryModelIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md",
            )}
        >
            <BoxesIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function RouteIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md transition-all duration-200",
                selected
                    ? "bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md"
                    : "text-stone-600 hover:bg-stone-200"
            )}
        >
            <LucideRouteIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function PrimaryUserIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md transition-all duration-200",
                selected
                    ? "bg-gradient-to-br from-green-500 to-lime-600 text-white shadow-md"
                    : "text-stone-600 hover:bg-stone-200"
            )}
        >
            <LucideUserIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function SecondaryUserIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md bg-gradient-to-br from-green-500 to-lime-600 text-white shadow-md",
            )}
        >
            <LucideUserIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function TitleFieldIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md bg-gradient-to-br from-slate-800 to-black text-white shadow-md",
            )}  
        >
            <AlignLeftIcon size={size} />
        </div>
    )
}


function FieldIcon({ size, selected }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md",
                selected ? "" : ""
            )}
        >
            <AlignLeftIcon size={size} />
        </div>
    )
}

function NotFoundIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-md",
            )}
        >
            <SearchXIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

export {
    PrimaryModelIcon,
    SecondaryModelIcon,
    TitleModelIcon,
    RouteIcon,
    PrimaryUserIcon,
    SecondaryUserIcon,
    FieldIcon,
    TitleFieldIcon,
    NotFoundIcon,
}