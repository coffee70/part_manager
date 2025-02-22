'use client'
import { Position } from "../types";
import { STAGE_BORDER_WIDTH } from "../stage";

const calculateOrigin = ({
    componentRect,
    containerRect,
    position,
}: {
    componentRect: DOMRect;
    containerRect: DOMRect;
    position: Position;
}) => {
    const x = componentRect.x - containerRect.x - STAGE_BORDER_WIDTH;
    const y = componentRect.y - containerRect.y - STAGE_BORDER_WIDTH;

    switch (position) {
        case Position.Left:
            return {
                x: x,
                y: y + (componentRect.height / 2),
            };
        case Position.Right:
            return {
                x: x + componentRect.width,
                y: y + (componentRect.height / 2),
            };
        case Position.Top:
            return {
                x: x + (componentRect.width / 2),
                y: y,
            };
        case Position.Bottom:
            return {
                x: x + (componentRect.width / 2),
                y: y + componentRect.height,
            };
    }
}

export { calculateOrigin };
