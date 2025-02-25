'use client'
import React from "react";
import { HANDLE_OFFSET } from "./handle_position.hook";

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
            left: x - HANDLE_OFFSET,
            right: x + width + HANDLE_OFFSET,
            top: y - HANDLE_OFFSET,
            bottom: y + height + HANDLE_OFFSET,
        }

        const onMouseMove = (e: MouseEvent) => {
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
        }

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        }
    });

    return { isHovered };
}