'use client'
import { STAGE_BORDER_WIDTH } from "../stage";
import { HandlePosition } from "../types";

const calculateOrigin = ({
    componentRect,
    containerRect,
    position,
}: {
    componentRect: DOMRect;
    containerRect: DOMRect;
    position: HandlePosition;
}) => {
    const x = componentRect.x - containerRect.x - STAGE_BORDER_WIDTH;
    const y = componentRect.y - containerRect.y - STAGE_BORDER_WIDTH;

    switch (position) {
        case HandlePosition.Left:
            return {
                x: x,
                y: y + (componentRect.height / 2),
            };
        case HandlePosition.Right:
            return {
                x: x + componentRect.width,
                y: y + (componentRect.height / 2),
            };
        case HandlePosition.TopMiddle:
            return {
                x: x + (componentRect.width / 2),
                y: y,
            };
        case HandlePosition.TopLeft:
            return {
                x: x + (componentRect.width / 5),
                y: y,
            };
        case HandlePosition.TopRight:
            return {
                x: x + (componentRect.width / 5) * 4,
                y: y,
            };
        case HandlePosition.BottomMiddle:
            return {
                x: x + (componentRect.width / 2),
                y: y + componentRect.height,
            };
        case HandlePosition.BottomLeft:
            return {
                x: x + (componentRect.width / 5),
                y: y + componentRect.height,
            };
        case HandlePosition.BottomRight:
            return {
                x: x + (componentRect.width / 5) * 4,
                y: y + componentRect.height,
            };
    }
}

export { calculateOrigin };
