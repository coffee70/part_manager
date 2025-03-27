import { StepType } from "@/types/collections";

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
  name: string;
  type: StepType;
}

export type Route = {
  isStarted?: boolean;
  routerId: string;
  currentStepId: string;
  nodes: Node[];
}