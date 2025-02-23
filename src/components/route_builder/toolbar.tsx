'use client'
import React from "react";
import { ArrowUpFromDotIcon, PlusIcon, TrashIcon } from "lucide-react";
import StepForm from "./step_form";
import { useBuilderContext } from "./builder.context";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Toolbar() {
    const [open, setOpen] = React.useState(false);

    const {
        isEditing,
        isItemSelected,
        removeSelectedItem,
        saveRoute,
    } = useBuilderContext();

    return (
        <div className="absolute bottom-4 right-4 flex gap-2">

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

            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10">
                        <ArrowUpFromDotIcon size={24} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                        <span>Add Starting Step</span>
                    </div>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10"
                        onClick={() => setOpen(true)}
                    >
                        <PlusIcon size={24} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                        <span>Add Step</span>
                    </div>
                </TooltipContent>
            </Tooltip>

            <StepForm open={open} setOpen={setOpen} />

            <button
                className="flex items-center justify-center bg-primary text-white text-sm font-bold shadow-md rounded-full h-10 px-4 disabled:opacity-50"
                disabled={!isEditing}
                onClick={() => saveRoute()}
            >
                <span>Save</span>
            </button>
        </div>
    )
}