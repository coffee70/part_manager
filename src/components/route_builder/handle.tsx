'use client'
import React from "react"
import { useBuilderContext } from "@/components/route_builder/builder.context";
import { cn } from "@/lib/utils";
import { ArrowBigDownIcon, ArrowBigLeftIcon, ArrowBigRightIcon, ArrowBigUpIcon, CirclePlusIcon } from "lucide-react";
import { Position } from "./types";
import { useHoverField } from "./hover_field.hook";

const getIcon = ({
    position,
    isAddingEdges,
    isSelected,
}: {
    position: Position;
    isAddingEdges?: boolean;
    isSelected?: boolean;
}) => {
    if (isAddingEdges && !isSelected) {
        return <CirclePlusIcon className="text-gray-800 fill-gray-300" />;
    }
    switch (position) {
        case Position.Left:
            return <ArrowBigLeftIcon className="text-gray-600 fill-gray-600" />;
        case Position.Right:
            return <ArrowBigRightIcon className="text-gray-600 fill-gray-600" />;
        case Position.Top:
            return <ArrowBigUpIcon className="text-gray-600 fill-gray-600" />;
        case Position.Bottom:
            return <ArrowBigDownIcon className="text-gray-600 fill-gray-600" />;
        default:
            return null;
    }
};

export const OFFSET = 30;

export default function Handle({
    nodeId,
    position,
    nodeRef,
    isNodeHovered
}: {
    nodeId: string;
    position: Position;
    nodeRef: React.RefObject<HTMLDivElement>;
    isNodeHovered?: boolean;
}) {
    const handleRef = React.useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isSelected, setIsSelected] = React.useState(false);
    const {
        isAddingEdges,
        addEndpoint,
    } = useBuilderContext();

    const handleClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSelected(() => !isAddingEdges ? !isSelected : false);
        addEndpoint({
            id: nodeId,
            position: position
        });
    }, [nodeId, position, isSelected, isAddingEdges, addEndpoint]);

    React.useEffect(() => {
        if (!isAddingEdges) setIsSelected(false);
    }, [isAddingEdges])

    useHoverField({
        nodeId,
        position,
        nodeRef,
        handleRef
    })

    return (
        <button
            ref={handleRef}
            className={cn(
                "absolute",
                (isHovered || isAddingEdges || isSelected) && "opacity-100",
                isNodeHovered && !isHovered && !isAddingEdges && "opacity-60",
                !isNodeHovered && !isHovered && !isAddingEdges && "invisible disabled",
            )}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {getIcon({
                position,
                isAddingEdges,
                isSelected
            })}
        </button>
    )
}