import { cn } from "@/lib/utils";
import {
    AlignLeftIcon,
    BoxesIcon,
    UserIcon as LucideUserIcon,
    RouteIcon as LucideRouteIcon,
    SearchXIcon,
    CaseSensitiveIcon,
    Clock3Icon,
    TextIcon,
    KeyRoundIcon,
    MousePointerClickIcon,
    CalendarIcon,
    HashIcon
} from "lucide-react"
import { type FieldType } from "@/types/collections";

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

function SecondaryRouteIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md",
            )}
        >
            <LucideRouteIcon size={size} strokeWidth={1.5} />
        </div>
    )
}

function TitleRouterIcon({ size }: Props) {
    return (
        <div
            className={cn(
                "p-1 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md",
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

function FieldType({ type, size }: { type: FieldType, size: number }) {
    switch (type) {
        case 'text':
            return <CaseSensitiveIcon size={size} />
        case 'number':
            return <HashIcon size={size} />
        case 'date':
            return <CalendarIcon size={size} />
        case 'time':
            return <Clock3Icon size={size} />
        case 'select':
            return <MousePointerClickIcon size={size} />
        case 'paragraph':
            return <TextIcon size={size} />
        case 'key_value':
            return <KeyRoundIcon size={size} />
    }
}

export {
    PrimaryModelIcon,
    SecondaryModelIcon,
    TitleModelIcon,
    RouteIcon,
    SecondaryRouteIcon,
    TitleRouterIcon,
    PrimaryUserIcon,
    SecondaryUserIcon,
    FieldIcon,
    TitleFieldIcon,
    NotFoundIcon,
    FieldType
}