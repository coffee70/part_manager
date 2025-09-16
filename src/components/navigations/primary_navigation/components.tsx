import { CondensedLogo } from "@/components/ui/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getContextColor } from "../lib";
import Link from "next/link";
import { Context } from "@/types/collections";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";

function PrimaryHeader() {
    return (
        <div className="px-2 mb-2">
            <CondensedLogo />
        </div>
    )
}

function PrimaryDivider() {
    return (
        <div className="border-b border-subtle mx-1 my-3" />
    )
}

function PrimarySeparator() {
    return (
        <div className="border-r border-subtle mt-auto" />
    )
}

function PrimaryGroup({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center space-y-2">
            {children}
        </div>
    )
}

function PrimaryItem({
    id,
    children,
    context,
    href,
}: {
    id?: string;
    children: React.ReactNode;
    context: Context;
    href: string;
}) {
    const contextColors = getContextColor(context);

    return (
        <Tooltip placement="right">
            <TooltipTrigger asChild>
                <Link
                    id={id}
                    href={href}
                    className={`focus:outline-none focus:ring-2 focus:${contextColors.ring}/50 rounded-md transition-all duration-200`}
                    title={context.charAt(0).toUpperCase() + context.slice(1)}
                >
                    {children}
                </Link>
            </TooltipTrigger>
            <TooltipContent className="relative">
                <TooltipWrapper>
                    <span>{context.charAt(0).toUpperCase() + context.slice(1)}</span>
                </TooltipWrapper>
            </TooltipContent>
        </Tooltip>
    )
}

export {
    PrimaryHeader,
    PrimaryDivider,
    PrimarySeparator,
    PrimaryGroup,
    PrimaryItem,
}
