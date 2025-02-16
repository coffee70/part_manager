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
    } = useBuilderContext();

    const onClick = () => {
        resetEndpoint();
    };

    const getStageProps = () => ({
        ref: containerRef,
        className: "relative m-6 border-dashed border-gray-400 rounded-md h-[720px]",
        style: {
            borderWidth: `${STAGE_BORDER_WIDTH}px`,
        },
        onClick,
    })

    return { getStageProps }
}



