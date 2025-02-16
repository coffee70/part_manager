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
        resetEndpoint,
    } = useBuilderContext();

    const onClick = React.useCallback(() => {
        resetEndpoint();
    }, [resetEndpoint]);

    return (
        <div
            ref={containerRef}
            className="relative m-6 border-dashed border-gray-600 rounded-md h-[720px]"
            style={{
                borderWidth: `${STAGE_BORDER_WIDTH}px`,
            }}
            onClick={onClick}
        >
            {route.nodes.map((node, index) => (
                <Node
                    key={node.id}
                    node={node}
                    ref={(el) => { nodeRefs.current[index] = el }}
                />
            ))}
            <svg className="absolute z-0 overflow-visible pointer-events-none" width="100%" height="100%">
                <defs>
                    {route.edges.map((edge, index) => (
                        <path
                            key={index}
                            id={edge.id}
                            d={edge.path}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />
                    ))}
                </defs>
                {route.edges.map((edge, index) => (
                    <use
                        key={index}
                        href={`#${edge.id}`}
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                    />
                ))}
            </svg>
            <Toolbar />
        </div >
    )
}



