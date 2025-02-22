'use client'
import React from "react";

/**
 * This file must be called nodelib.ts instead of node.ts because when
 * trying to import from "./node" an error will be thrown, I am guessing
 * because of the name conflict with Node.js.
 */

export const calculateNodePosition = ({
    target,
    containerRef,
}: {
    target: Element;
    containerRef: React.RefObject<HTMLDivElement>;
}) => {
    if (!containerRef.current) throw new Error("containerRef is not assigned");
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    console.log("updateNodePosition: updated calculated node position", targetRect.x - containerRect.x, targetRect.y - containerRect.y);
    return {
        x: targetRect.x - containerRect.x,
        y: targetRect.y - containerRect.y,
    };
}