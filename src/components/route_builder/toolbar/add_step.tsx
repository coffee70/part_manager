'use client'
import React from "react";
import { PlusIcon } from "lucide-react";
import StepForm from "../step_form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export default function AddStep() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
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
        </>
    )
}