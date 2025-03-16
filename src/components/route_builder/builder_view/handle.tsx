'use client'
import React from "react"
import { useBuilderContext } from "@/components/route_builder/builder_view/builder.context";
import { cn } from "@/lib/utils";
import { ArrowBigDownIcon, ArrowBigLeftIcon, ArrowBigRightIcon, ArrowBigUpIcon, CirclePlusIcon } from "lucide-react";
import { useHandlePosition } from "./handle_position.hook";
import { HandlePosition, START_NODE_ID } from "./types";

const getIcon = ({
    position,
    isAddingEdges,
    isSelected,
    isStartNode,
}: {
    position: HandlePosition;
    isAddingEdges?: boolean;
    isSelected?: boolean;
    isStartNode?: boolean;
}) => {
    if (isAddingEdges && !isSelected) {
        if (isStartNode) return null;
        return <CirclePlusIcon className="w-4 h-4 text-gray-800 fill-gray-300 opacity-60 hover:opacity-100" />;
    }

    const className = "w-5 h-5 text-gray-600 fill-gray-600"

    switch (position) {
        case HandlePosition.Left:
            return <ArrowBigLeftIcon className={className} />;
        case HandlePosition.Right:
            return <ArrowBigRightIcon className={className} />;
        case HandlePosition.TopLeft:
            return <ArrowBigUpIcon className={className} />;
        case HandlePosition.TopRight:
            return <ArrowBigUpIcon className={className} />;
        case HandlePosition.TopMiddle:
            return <ArrowBigUpIcon className={className} />;
        case HandlePosition.BottomLeft:
            return <ArrowBigDownIcon className={className} />;
        case HandlePosition.BottomRight:
            return <ArrowBigDownIcon className={className} />;
        case HandlePosition.BottomMiddle:
            return <ArrowBigDownIcon className={className} />;
        default:
            return null;
    }
};

export default function Handle({
    nodeId,
    position,
    nodeRef,
    isNodeHovered
}: {
    nodeId: string;
    position: HandlePosition;
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
            position: position,
        });
    }, [nodeId, position, isSelected, isAddingEdges, addEndpoint]);

    React.useEffect(() => {
        if (!isAddingEdges) setIsSelected(false);
    }, [isAddingEdges])

    useHandlePosition({
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
            <div className="flex items-center justify-center w-6 h-6">
                {getIcon({
                    position,
                    isAddingEdges,
                    isSelected,
                    isStartNode: nodeId === START_NODE_ID,
                })}
            </div>
        </button>
    )
}