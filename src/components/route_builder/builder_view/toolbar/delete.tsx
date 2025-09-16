'use client'
import React from "react";
import { Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import { useBuilderContext } from "../builder.context";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";

export default function Delete() {
    const { removeRoute } = useBuilderContext();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    className="flex items-center justify-center bg-destructive-foreground text-destructive shadow-md rounded-full h-10 w-10 disabled:opacity-50"
                    onClick={removeRoute}
                >
                    <Trash2Icon size={24} />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <TooltipWrapper>
                    <span>Remove Route</span>
                </TooltipWrapper>
            </TooltipContent>
        </Tooltip>
    )
}