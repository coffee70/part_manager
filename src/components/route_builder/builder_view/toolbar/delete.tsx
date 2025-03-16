'use client'
import React from "react";
import { Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import { useBuilderContext } from "../builder.context";

export default function Delete() {
    const { removeRoute } = useBuilderContext();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    className="flex items-center justify-center bg-red-100 text-destructive shadow-md rounded-full h-10 w-10 disabled:opacity-50"
                    onClick={removeRoute}
                >
                    <Trash2Icon size={24} />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                    <span>Remove Route</span>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}