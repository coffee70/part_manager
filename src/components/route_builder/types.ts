import { StepType } from "@/types/collections";

export type Endpoint = {
    id: string;
    position: Position;
}

export enum Position {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export type Edge = {
    sourceId: string;
    sourcePosition: Position;
    targetId: string;
    targetPosition: Position;
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

