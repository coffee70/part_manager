import { StepType } from "@/types/collections";

export enum HandlePosition {
    TopLeft = "top-left",
    TopRight = "top-right",
    TopMiddle = "top",
    BottomLeft = "bottom-left",
    BottomRight = "bottom-right",
    BottomMiddle = "bottom",
    Left = "left",
    Right = "right"
}

export type Endpoint = {
    id: string;
    position: HandlePosition;
}

export enum Position {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export type Edge = {
    id: string;
    sourceId: string;
    sourcePosition: HandlePosition;
    targetId: string;
    targetPosition: HandlePosition;
    path: string;
}

export type Node = {
    id: string;
    name: string;
    type: StepType;
    x: number;
    y: number;
}

export type Route = {
    nodes: Node[];
    edges: Edge[];
};

