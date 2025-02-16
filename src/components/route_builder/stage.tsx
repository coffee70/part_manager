'use client'
import { useBuilderContext } from "@/components/route_builder/builder.context";
import React from "react"
import Node from "./node";
import Toolbar from "./toolbar";
import Background from "./background";
import Edges from "./edges";
import Nodes from "./nodes";

export const STAGE_BORDER_WIDTH = 2;

export default function Stage() {
    const { getStageProps } = useStage();

    return (
        <div {...getStageProps()}>
            <Nodes />
            <Edges />
            <Background />
            <Toolbar />
        </div >
    )
}

function useStage() {
    const {
        containerRef,
        resetEndpoint,
        setSelectedNode,
        setSelectedEdge,
        removeSelectedItem,
    } = useBuilderContext();

    const onClick = () => {
        resetEndpoint();
        setSelectedNode(null);
        setSelectedEdge(null);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            resetEndpoint();
            setSelectedNode(null);
            setSelectedEdge(null);
        }

        if (e.key === "Backspace" || e.key === "Delete") {
            removeSelectedItem();
        }
    }

    const getStageProps = () => ({
        ref: containerRef,
        className: "relative m-6 border-dashed border-gray-400 rounded-md h-[720px] outline-none",
        style: {
            borderWidth: `${STAGE_BORDER_WIDTH}px`,
        },
        onClick,
        onKeyDown,
        tabIndex: 0,
    })

    return { getStageProps }
}



