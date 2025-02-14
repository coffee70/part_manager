'use client'
import { useBuilderContext } from "@/components/route_builder/builder.context";
import { useConnectorHover } from "@/components/route_builder/connector_hover.hook";
import useDragger from "@/components/route_builder/draggable.hook";
import React, { useImperativeHandle } from "react"
import Connector from "./handle";
import { Position } from "./edge";
import { cn } from "@/lib/utils";

export type NodeType = {
    id: string;
    x: number;
    y: number;
}

type NodeProps = {
    node: NodeType;
    containerRef: React.RefObject<HTMLDivElement>,
}

const Node = React.forwardRef<HTMLDivElement, NodeProps>((props, ref) => {
    const { node, containerRef } = props;

    const internalRef = React.useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => {
        if (!internalRef.current) throw new Error("draggableRef is not assigned");
        return internalRef.current;
    });

    const { addingNodes } = useBuilderContext();

    useDragger({
        containerRef,
        draggableRef: internalRef,
    });

    const {
        position: activePosition,
    } = useConnectorHover({ draggableRef: internalRef });

    const { resizeObserver, mutationObserver } = useBuilderContext();

    React.useEffect(() => {
        if (!internalRef.current) throw new Error("draggableRef is not assigned");
        if (!containerRef.current) throw new Error("containerRef is not assigned");

        const element = internalRef.current;

        resizeObserver.observe(element);
        mutationObserver.observe(element, {
            attributes: true,
        });

        return () => {
            resizeObserver.unobserve(element);
            mutationObserver.disconnect();
        }
    })

    return (
        <div
            ref={internalRef}
            id={node.id}
            className={cn(
                "absolute flex items-center h-8 border border-blue-500 rounded-md cursor-grab select-none",
                addingNodes && "cursor-pointer",
            )}
            style={{
                left: node.x - 40,
                top: node.y - 20,
            }}
        >
            <Connector
                nodeId={node.id}
                right
                hovered={activePosition === Position.Left}
                position={Position.Left}
            />
            <span>Status</span>
            <Connector
                nodeId={node.id}
                left
                hovered={activePosition === Position.Right}
                position={Position.Right}
            />
        </div>
    )
})

Node.displayName = "Node";

export default Node;