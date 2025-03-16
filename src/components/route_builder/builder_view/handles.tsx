'use client'
import Handle from "./handle";
import { HandlePosition } from "./types";

export default function Handles({
    nodeId,
    nodeRef,
    isNodeHovered,
}: {
    nodeId: string;
    nodeRef: React.RefObject<HTMLDivElement>;
    isNodeHovered: boolean;
}) {
    // Get only the string values from the enum
    return Object.values(HandlePosition)
        .filter((value): value is HandlePosition => typeof value === "string")
        .map(position => (
            <Handle
                key={position}
                nodeId={nodeId}
                position={position}
                nodeRef={nodeRef}
                isNodeHovered={isNodeHovered}
            />
        )
        );
}