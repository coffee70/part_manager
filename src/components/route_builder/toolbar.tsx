'use client'
import React from "react";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useBuilderContext } from "./builder.context";
import StepForm from "./step_form";

export default function Toolbar() {
    return (
        <div className="absolute bottom-4 right-4 flex gap-2">
            <StepForm>
                <button className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10">
                    <PlusIcon size={24} />
                </button>
            </StepForm>
        </div>
    )
}