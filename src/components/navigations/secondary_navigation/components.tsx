'use client'
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { getContextColor } from "../lib";
import Link from "next/link";
import { Context } from "@/types/collections";

function SecondaryGroup({
    label,
    children,
    action,
    context,
}: {
    label: string;
    children?: React.ReactNode;
    action?: () => void;
    context: Context;
}) {
    return (
        <div className="mt-1 px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-500">{label.toUpperCase()}</span>
                {action && <button
                    type="button"
                    className={`p-1 rounded-md hover:bg-stone-300 transition-colors duration-200`}
                    onClick={action}
                    title={`Add ${label}`}
                >
                    <PlusIcon size={14} />
                </button>}
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

function SecondaryItem({
    id,
    selected,
    children,
    href,
    onMouseEnter,
    onMouseLeave,
    isHovered,
}: {
    id?: string
    selected?: boolean;
    children: React.ReactNode;
    href: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    isHovered?: boolean;
}) {
    return (
        <Link
            id={id}
            className={cn(
                "flex items-center space-x-3 px-2 py-1.5 text-stone-600 text-sm rounded-lg cursor-pointer transition-all duration-200",
                selected
                    ? "bg-white shadow-sm text-stone-800 font-medium"
                    : isHovered
                        ? "bg-white/70 text-stone-700"
                        : "hover:bg-white/50"
            )}
            href={href}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            aria-selected={selected}
        >
            {children}
        </Link>
    )
}

function SecondaryGenericItem({
    label,
    top,
    bottom,
    selected,
    context,
    href,
    onMouseEnter,
    onMouseLeave,
    isHovered,
}: {
    label: string;
    top?: boolean;
    bottom?: boolean;
    selected?: boolean;
    context: Context;
    href: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    isHovered?: boolean;
}) {
    const contextColors = getContextColor(context);
    const circleColor = selected
        ? `${contextColors.bg} ${contextColors.border}`
        : isHovered
            ? `bg-white ${contextColors.border}`
            : "bg-white border-stone-300";

    return (
        <Link
            className={cn(
                "flex items-center space-x-3 h-10 text-stone-600 text-sm rounded-lg cursor-pointer transition-all duration-200",
                selected
                    ? "bg-white shadow-sm text-stone-800 font-medium"
                    : isHovered
                        ? "bg-white/70 text-stone-700"
                        : "hover:bg-white/50"
            )}
            href={href}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            aria-selected={selected}
        >
            <div className="flex flex-col items-center justify-center h-full w-6 relative">
                {/* Vertical connecting line */}
                <div className="absolute inset-0 flex flex-col items-center">
                    <div className={cn("w-[2px] h-1/2",
                        top ? "bg-transparent" : selected || isHovered ? contextColors.bg : "bg-stone-300"
                    )} />
                    <div className={cn("w-[2px] h-1/2",
                        bottom ? "bg-transparent" : selected || isHovered ? contextColors.bg : "bg-stone-300"
                    )} />
                </div>

                {/* Circle indicator */}
                <div className={cn(
                    "z-10 rounded-full w-2 h-2 border-2 transition-all duration-200",
                    circleColor
                )} />
            </div>
            <span className="py-2">{label}</span>
        </Link>
    )
}

export {
    SecondaryGroup,
    SecondaryItem,
    SecondaryGenericItem,
}