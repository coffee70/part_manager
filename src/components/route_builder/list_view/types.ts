type Valuable = {
    values?: Values;
}

type Values = {
    [key: string]: string | string[] | undefined;
}

export type RouteFormState = {
    route: Route;
};

export interface Instance {
    _id: string;
    number: string;
}

export interface Router {
    _id: string;
    name: string;
}

export type Node = {
    id: string;
    instanceId: string;
} & Valuable

export type Route = {
    state: RouteState;
    routerId: string;
    currentStepId: string | null;
    nodes: Node[];
}

export enum RouteState {
    Started = "started",
    Paused = "paused",
    Completed = "completed",
    Stopped = "stopped",
}