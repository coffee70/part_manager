'use client'
import React from "react";
import { ArrowUpFromDotIcon } from "lucide-react";
import { useBuilderContext } from "@/components/route_builder/builder_view/builder.context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { START_NODE_ID } from "@/components/route_builder/builder_view/types";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";

export default function AddStartingStep() {
    const { 
        addStartNode,
        hasStartNode,
    } = useBuilderContext();

    const onClick = () => {
        if (hasStartNode()) return;
        addStartNode({
            id: START_NODE_ID,
            x: 0,
            y: 0,
        });
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10 disabled:opacity-50"
                    onClick={onClick}
                    disabled={hasStartNode()}
                >
                    <ArrowUpFromDotIcon size={24} />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <TooltipWrapper>
                    <span>Add Starting Step</span>
                </TooltipWrapper>
            </TooltipContent>
        </Tooltip>
    )
}