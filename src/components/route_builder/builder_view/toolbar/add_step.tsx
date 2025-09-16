'use client'
import React from "react";
import { PlusIcon } from "lucide-react";
import StepForm from "../step_form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";

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
                    <TooltipWrapper>
                        <span>Add Step</span>
                    </TooltipWrapper>
                </TooltipContent>
            </Tooltip>

            <StepForm open={open} setOpen={setOpen} />
        </>
    )
}