'use client'
import React from "react";

type Props = {
    containerRef: React.RefObject<HTMLDivElement>;
    draggableRef: React.RefObject<HTMLDivElement>;
}

function useDragger({ containerRef, draggableRef }: Props) {
    const isClicked = React.useRef<boolean>(false);
    const isDragging = React.useRef<boolean>(false);

    const coords = React.useRef<{
        startX: number,
        startY: number,
        lastX: number,
        lastY: number
    }>({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })

    React.useEffect(() => {
        if (!draggableRef.current) throw new Error("draggableRef is not assigned");
        if (!containerRef.current) throw new Error("containerRef is not assigned");

        const onMouseDown = (e: MouseEvent) => {
            isClicked.current = true;
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
        }

        const onMouseUp = (e: MouseEvent) => {
            isClicked.current = false;
            isDragging.current = false;

            if (!draggableRef.current) return;

            coords.current.lastX = draggableRef.current.offsetLeft;
            coords.current.lastY = draggableRef.current.offsetTop;
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!isClicked.current) return;
            if (!draggableRef.current) return;

            isDragging.current = true;

            const nextX = e.clientX - coords.current.startX + coords.current.lastX;
            const nextY = e.clientY - coords.current.startY + coords.current.lastY;

            draggableRef.current.style.top = `${nextY}px`;
            draggableRef.current.style.left = `${nextX}px`;
        }

        draggableRef.current.addEventListener('mousedown', onMouseDown);
        draggableRef.current.addEventListener('mouseup', onMouseUp);
        containerRef.current.addEventListener('mousemove', onMouseMove);
        containerRef.current.addEventListener('mouseleave', onMouseUp);

        const draggable = draggableRef.current;
        const container = containerRef.current;

        return () => {
            draggable.removeEventListener('mousedown', onMouseDown);
            draggable.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseUp);
        }
    }, [containerRef, draggableRef])

    return { isDragging: isDragging.current };

}

export default useDragger;