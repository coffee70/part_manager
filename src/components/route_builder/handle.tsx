'use client'
import React from "react"
import { useBuilderContext } from "@/components/route_builder/builder.context";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Position } from "./types";

export default function Connector({
    nodeId,
    left,
    right,
    isHovered,
    position,
}: {
    nodeId: string;
    left?: boolean;
    right?: boolean;
    isHovered?: boolean;
    position: Position;
}) {
    const [selected, setSelected] = React.useState(false);
    const {
        isAddingEdges,
        addEndpoint,
    } = useBuilderContext();

    const handleClick = React.useCallback(() => {
        setSelected(() => !isAddingEdges ? !selected : false);
        addEndpoint({
            id: nodeId,
            position: position
        });
    }, [nodeId, position, selected, isAddingEdges]);

    React.useEffect(() => {
        if (!isAddingEdges) setSelected(false);
    }, [isAddingEdges])

    return (
        <button
            className={cn(
                "h-4 w-4 bg-black text-white rounded-full",
                left && "-mr-2 ml-2",
                right && "-ml-2 mr-2",
                selected && "ring-2 ring-black ring-offset-1",
                !isHovered && !isAddingEdges && "invisible disabled",
            )}
            onClick={handleClick}
        >
            {(!isAddingEdges || (isAddingEdges && !selected)) && <PlusIcon size={16} />}
        </button>
    )
}