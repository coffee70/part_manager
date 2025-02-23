'use client'
import React from "react";
import { useHoverField } from "./hover_field.hook";
import useDragger from "./draggable.hook";
import { useBuilderContext } from "./builder.context";
import { useObserver } from "./observer.hook";
import { cva } from "class-variance-authority";
import Handle from "./handle";
import { HandlePosition, type StartNode } from "./types";
import { STAGE_BORDER_WIDTH } from "./stage";

export const START_NODE_ID = "start";

const startNodeVariants = cva(
    "absolute z-10 p-1 w-14 h-14 flex items-center justify-center bg-foreground border border-muted-foreground text-xs font-semibold rounded-full select-none",
    {
        variants: {
            dragging: {
                true: "cursor-grabbing",
                false: "cursor-grab",
            }
        },
        defaultVariants: {
            dragging: false
        }
    }
)

export default function StartNode({ node }: { node: StartNode }) {
    const internalRef = React.useRef<HTMLDivElement>(null);

    const { containerRef } = useBuilderContext();

    const { isHovered } = useHoverField({
        draggableRef: internalRef,
    })

    const { isDragging } = useDragger({
        containerRef,
        draggableRef: internalRef,
        lastX: node.x,
        lastY: node.y,
    })

    useObserver({
        draggableRef: internalRef,
    })

    if (!node) return null;

    return (
        <div
            id={START_NODE_ID}
            ref={internalRef}
            style={{
                left: node.x - STAGE_BORDER_WIDTH,
                top: node.y - STAGE_BORDER_WIDTH,
            }}
            className={startNodeVariants({
                dragging: isDragging
            })}>
            <span>START</span>
            <Handle
                nodeId={START_NODE_ID}
                position={HandlePosition.Left}
                nodeRef={internalRef}
                isNodeHovered={isHovered}
            />
            <Handle
                nodeId={START_NODE_ID}
                position={HandlePosition.Right}
                nodeRef={internalRef}
                isNodeHovered={isHovered}
            />
            <Handle
                nodeId={START_NODE_ID}
                position={HandlePosition.TopMiddle}
                nodeRef={internalRef}
                isNodeHovered={isHovered}
            />
            <Handle
                nodeId={START_NODE_ID}
                position={HandlePosition.BottomMiddle}
                nodeRef={internalRef}
                isNodeHovered={isHovered}
            />
        </div>
    )
}