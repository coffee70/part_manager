'use client'
import React from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import StepForm from "./step_form";
import { useBuilderContext } from "./builder.context";
import { cn } from "@/lib/utils";

export default function Toolbar() {
    const { isItemSelected, removeSelectedItem } = useBuilderContext();

    return (
        <div className="absolute bottom-4 right-4 flex gap-2">
            <button
                className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10 disabled:opacity-50"
                disabled={!isItemSelected()}
                onClick={() => removeSelectedItem()}
            >
                <TrashIcon size={24} />
            </button>
            <StepForm>
                <button className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10">
                    <PlusIcon size={24} />
                </button>
            </StepForm>
        </div>
    )
}