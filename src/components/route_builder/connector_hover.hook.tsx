'use client'
import React from "react";
import { Position } from "./types";

export function useConnectorHover({ draggableRef }: { draggableRef: React.RefObject<HTMLDivElement> }) {
    const [position, setPosition] = React.useState<Position | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const getRelativeMousePosition = (event: MouseEvent) => {
        if (!draggableRef.current) return null;

        const rect = draggableRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;

        return x / width;
    }

    const determineSide = (event: MouseEvent): Position | null => {
        if (isDragging) return null;

        const relativePosition = getRelativeMousePosition(event);
        if (relativePosition === null) {
            return null;
        }

        if (relativePosition > 0.6) {
            return Position.Right;
        } else if (relativePosition < 0.4) {
            return Position.Left;
        } else {
            return null;
        }
    }

    const handleMouseMove = (event: MouseEvent) => {
        const newSide = determineSide(event);
        setPosition(newSide);
    };

    const handleMouseOut = () => {
        setPosition(null);
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    React.useEffect(() => {
        if (!draggableRef.current) throw new Error("draggableRef is not assigned");

        const element = draggableRef.current;
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseout', handleMouseOut);
        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mouseup', handleMouseUp);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseout', handleMouseOut);
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mouseup', handleMouseUp);
        }
    })

    return {
        position
    }
}