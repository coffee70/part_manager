'use client'
import React from "react";
import { useBuilderContext } from "./builder.context";

export function useObserver({
    draggableRef,
}: {
    draggableRef: React.RefObject<HTMLDivElement>;
}) {
    const { updateEdges, containerRef } = useBuilderContext();

    React.useEffect(() => {
        if (!draggableRef.current) throw new Error("draggableRef is not assigned");
        if (!containerRef.current) throw new Error("containerRef is not assigned");

        const element = draggableRef.current;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                updateEdges(entry.target);
            }
        });

        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    updateEdges(mutation.target as Element);
                }
            }
        });

        resizeObserver.observe(element);
        mutationObserver.observe(element, {
            attributes: true,
        });

        return () => {
            resizeObserver.unobserve(element);
            mutationObserver.disconnect();
        }
    }, [draggableRef, containerRef]);
}