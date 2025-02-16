'use client'
import React from "react";
import { OFFSET } from "./handle";

export function useHoverField({
    draggableRef,
}: {
    draggableRef: React.RefObject<HTMLDivElement>;
}) {
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        if (!draggableRef.current) throw new Error("draggableRef is not assigned");
        const rect = draggableRef.current.getBoundingClientRect();
        const x = rect.x
        const y = rect.y
        const width = rect.width;
        const height = rect.height;

        const hoverRect = {
            left: x - OFFSET,
            right: x + width + OFFSET,
            top: y - OFFSET,
            bottom: y + height + OFFSET,
        }

        window.addEventListener("mousemove", (e) => {
            if (
                e.x > hoverRect.left
                && e.x < hoverRect.right
                && e.y > hoverRect.top
                && e.y < hoverRect.bottom
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        });
    });

    return { isHovered };
}