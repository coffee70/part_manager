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
    edges: Edge[];
}

export type Route = Array<Node>;

