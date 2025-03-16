'use client'
import { Position, HandlePosition } from "./types";

const handlePositionToNodePosition = (nodePosition: HandlePosition): Position => {
    switch (nodePosition) {
        case HandlePosition.Left:
            return Position.Left;
        case HandlePosition.Right:
            return Position.Right;
        case HandlePosition.TopLeft:
            return Position.Top;
        case HandlePosition.TopRight:
            return Position.Top;
        case HandlePosition.TopMiddle:
            return Position.Top;
        case HandlePosition.BottomLeft:
            return Position.Bottom;
        case HandlePosition.BottomRight:
            return Position.Bottom;
        case HandlePosition.BottomMiddle:
            return Position.Bottom;
    }
};

export { handlePositionToNodePosition };