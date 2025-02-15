'use client'
import { useBuilderContext } from "@/components/route_builder/builder.context";
import React from "react"
import Node from "./node";
import Toolbar from "./toolbar";

export const STAGE_BORDER_WIDTH = 2;

export default function Stage() {
    const {
        route,
        containerRef,
        nodeRefs,
    } = useBuilderContext();

    return (
        <div
            ref={containerRef}
            className="relative m-6 border-dashed border-gray-600 rounded-md h-[720px]"
            style={{
                borderWidth: `${STAGE_BORDER_WIDTH}px`,
            }}
        >
            {route.map((node, index) => (
                <Node
                    key={node.id}
                    node={node}
                    containerRef={containerRef}
                    ref={(el) => { nodeRefs.current[index] = el }}
                />
            ))}
            <svg className="absolute z-0 overflow-visible pointer-events-none" width="100%" height="100%">
                {route.flatMap(node =>
                    node.edges.map(edge => (
                        <path
                            key={`${node.id}-${edge.targetId}`}
                            d={edge.path}
                            stroke="black"
                            fill="transparent"
                        />
                    ))
                )}
            </svg>
            <Toolbar />
        </div >
    )
}



