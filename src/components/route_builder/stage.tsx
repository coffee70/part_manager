'use client'
import { BuilderProvider, useBuilderContext } from "@/components/route_builder/builder.context";
import React from "react"
import Node, { NodeType } from "./node";
import { PlusIcon, XIcon } from "lucide-react";
import Toolbar from "./toolbar";

export default function Stage() {
    const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [nodes, setNodes] = React.useState<NodeType[]>([]);
    const { addingNodes } = useBuilderContext();
    const { edges, containerRef } = useBuilderContext();

    const onClick = (e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;
        if (addingNodes) {
            setNodes((prev) => {
                const newNode = {
                    id: `node-${prev.length + 1}`,
                    x: e.clientX - container.getBoundingClientRect().left,
                    y: e.clientY - container.getBoundingClientRect().top,
                }
                return [...prev, newNode]
            });
        }
    }
        

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className="relative m-6 border-dashed border-gray-600 rounded-md h-[700px]"
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



