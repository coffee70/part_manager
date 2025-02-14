'use client'
import React from "react";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useBuilderContext } from "./builder.context";

export default function Toolbar() {
    const { addingNodes, setAddingNodes } = useBuilderContext();

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAddingNodes(!addingNodes);
    }

    return (
        <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={onClick} className="flex items-center justify-center bg-foreground shadow-md rounded-full h-10 w-10">
                {addingNodes ? <XIcon size={24} /> : <PlusIcon size={24} />}
            </button>
        </div>
    )
}