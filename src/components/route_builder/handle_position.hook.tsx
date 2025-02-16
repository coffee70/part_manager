'use client'
import React from "react";
import { Position } from "./types";
import { OFFSET } from "./handle";

export function useHandlePosition({
    nodeId,
    position,
    nodeRef,
    handleRef
}: {
    nodeId: string;
    position: Position;
    nodeRef: React.RefObject<HTMLDivElement>;
    handleRef: React.RefObject<HTMLButtonElement>;
}) {
    React.useEffect(() => {
        if (!nodeRef.current) throw new Error("nodeRef is not assigned");
        const handle = handleRef.current;
        if (!handle) throw new Error("handleRef is not assigned");
        const node = nodeRef.current;

        const {
            width: nodeWidth,
            height: nodeHeight
        } = node.getBoundingClientRect();
        const {
            width: handleWidth,
            height: handleHeight
        } = handle.getBoundingClientRect();

        switch (position) {
            case Position.Left:
                handle.style.left = `${-OFFSET}px`;
                handle.style.top = `${(nodeHeight / 2) - (handleHeight / 2)}px`;
                break;
            case Position.Right:
                handle.style.right = `${-OFFSET}px`;
                handle.style.top = `${(nodeHeight / 2) - (handleHeight / 2)}px`;
                break;
            case Position.Top:
                handle.style.left = `${(nodeWidth / 2) - (handleWidth / 2)}px`;
                handle.style.top = `${-OFFSET}px`;
                break;
            case Position.Bottom:
                handle.style.left = `${(nodeWidth / 2) - (handleWidth / 2)}px`;
                handle.style.bottom = `${-OFFSET}px`;
                break;
        }
    }, [nodeId, position, nodeRef]);
}