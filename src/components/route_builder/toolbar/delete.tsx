'use client'
import React from "react";
import { TrashIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useBuilderContext } from "../builder.context";

export default function Delete() {

    const {
        isItemSelected,
        removeSelectedItem,
    } = useBuilderContext();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10 disabled:opacity-50"
                    disabled={!isItemSelected()}
                    onClick={() => removeSelectedItem()}
                >
                    <TrashIcon size={24} />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                    <span>Delete</span>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}