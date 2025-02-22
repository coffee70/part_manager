'use client'
import React from "react";
import { HandlePosition } from "./types";
import { useBuilderContext } from "./builder.context";

export const HANDLE_OFFSET = 25;

export function useHandlePosition({
    nodeId,
    position,
    nodeRef,
    handleRef
}: {
    nodeId: string;
    position: HandlePosition;
    nodeRef: React.RefObject<HTMLDivElement>;
    handleRef: React.RefObject<HTMLButtonElement>;
}) {
    const { route } = useBuilderContext();

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
            case HandlePosition.Left:
                handle.style.left = `${-HANDLE_OFFSET}px`;
                handle.style.top = `${(nodeHeight / 2) - (handleHeight / 2)}px`;
                break;
            case HandlePosition.Right:
                handle.style.right = `${-HANDLE_OFFSET}px`;
                handle.style.top = `${(nodeHeight / 2) - (handleHeight / 2)}px`;
                break;
            case HandlePosition.TopMiddle:
                handle.style.left = `${(nodeWidth / 2) - (handleWidth / 2)}px`;
                handle.style.top = `${-HANDLE_OFFSET}px`;
                break;
            case HandlePosition.TopLeft:
                handle.style.left = `${(nodeWidth / 5) - (handleWidth / 2)}px`;
                handle.style.top = `${-HANDLE_OFFSET}px`;
                break;
            case HandlePosition.TopRight:
                handle.style.right = `${(nodeWidth / 5) - (handleWidth / 2)}px`;
                handle.style.top = `${-HANDLE_OFFSET}px`;
                break;
            case HandlePosition.BottomMiddle:
                handle.style.left = `${(nodeWidth / 2) - (handleWidth / 2)}px`;
                handle.style.bottom = `${-HANDLE_OFFSET}px`;
                break;
            case HandlePosition.BottomLeft:
                handle.style.left = `${(nodeWidth / 5) - (handleWidth / 2)}px`;
                handle.style.bottom = `${-HANDLE_OFFSET}px`;
                break;
            case HandlePosition.BottomRight:
                handle.style.right = `${(nodeWidth / 5) - (handleWidth / 2)}px`;
                handle.style.bottom = `${-HANDLE_OFFSET}px`;
                break;
        }
    }, [nodeId, position, nodeRef, handleRef, route]);
}