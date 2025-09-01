import { StepState } from "@/types/collections";

export const START_NODE_ID = "start" as const;

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
    forBidirectionality?: boolean;
}

export type Node = {
    id: string;
    name: string;
    type: StepState;
    x: number;
    y: number;
}

export type StartNode = {
    id: typeof START_NODE_ID;
    x: number;
    y: number;
}

export type Route = {
    routerId: string;
    currentStepId: string;
    startEdge?: Edge;
    startNode?: StartNode;
    nodes: Node[];
    edges: Edge[];
};

export type Notification = {
    message: string;
    type: 'success' | 'error';
}
