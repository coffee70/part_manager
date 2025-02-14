'use client'
import { useBuilderContext } from "@/components/route_builder/builder.context";
import React from "react"
import Node, { NodeType } from "./node";
import Toolbar from "./toolbar";

export const STAGE_BORDER_WIDTH = 2;

export default function Stage() {
    const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [nodes, setNodes] = React.useState<NodeType[]>([
        {
            id: "node-1",
            x: 0,
            y: 0,
        },
        {
            id: "node-2",
            x: 0,
            y: 0,
        },
        {
            id: "node-3",
            x: 0,
            y: 0,
        },
        {
            id: "node-4",
            x: 0,
            y: 0,
        }
    ]);
    const { edges, containerRef } = useBuilderContext();

    return (
        <div
            ref={containerRef}
            className="relative m-6 border-dashed border-gray-600 rounded-md h-[720px]"
            style={{
                borderWidth: `${STAGE_BORDER_WIDTH}px`,
            }}
        >
            {nodes.map((node, index) => (
                <Node
                    key={node.id}
                    node={node}
                    containerRef={containerRef}
                    ref={(el) => { nodeRefs.current[index] = el }}
                />
            ))}
            <svg className="absolute z-0 overflow-visible pointer-events-none">
                {edges.map((edge) => (
                    <path
                        key={edge.id}
                        d={edge.path}
                        stroke="black"
                        fill="transparent"
                    />
                ))}
            </svg>
            <Toolbar />
        </div>
    )
}



