'use client'
import React from "react"
import { useBuilderContext } from "@/components/route_builder/builder.context";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Position } from "./edge";

export default function Connector({
    nodeId,
    left,
    right,
    hovered,
    position,
}: {
    nodeId: string;
    left?: boolean;
    right?: boolean;
    hovered?: boolean;
    position: Position;
}) {
    const [selected, setSelected] = React.useState(false);
    const { 
        addingNodes,
        addingEdges,
        setAddingEdges,
        setEndpoint,
     } = useBuilderContext();

    const handleClick = () => {
        setAddingEdges(!addingEdges);
        setSelected(() => !addingEdges ? !selected : false);
        setEndpoint({
            id: nodeId,
            position: position
        });
    }

    React.useEffect(() => {
        if (!addingEdges) setSelected(false);
    }, [addingEdges])

    return (
        <button
            className={cn(
                "h-4 w-4 bg-black text-white rounded-full",
                left && "-mr-2 ml-2",
                right && "-ml-2 mr-2",
                selected && "ring-2 ring-black ring-offset-1",
                (addingNodes || !hovered) && !addingEdges && "invisible disabled",
            )}
            onClick={handleClick}
        >
            {(!addingEdges || (addingEdges && !selected)) && <PlusIcon size={16} />}
        </button>
    )
}