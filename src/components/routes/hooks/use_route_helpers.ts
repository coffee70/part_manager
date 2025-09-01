'use client'
import { Route, StepState, Node, RouteState } from "@/types/collections";

// Extended Node type to include name property that exists at runtime
export interface ExtendedNode extends Node {
    name: string;
}

// Extended Route type with proper node typing
export interface ExtendedRoute extends Omit<Route, 'nodes'> {
    nodes: ExtendedNode[];
}

export interface RouteHelpers {
    isStepCompleted: (stepId: string) => boolean;
    isStepFailed: (stepId: string) => boolean;
    isRouteCompleted: () => boolean;
    isRouteStopped: () => boolean;
    isRoutePaused: () => boolean;
    isRouteIdle: () => boolean;
    isRouteStarted: () => boolean;
    isCurrentStep: (stepId: string) => boolean;
    isPreviousStep: (stepId: string) => boolean;
    isNextStep: (stepId: string) => boolean;
    isRedoStep: (stepId: string) => boolean;
    isOnLastStep: () => boolean;
    isLastStep: (stepId: string) => boolean;
}

// Custom hook to handle route state logic
export function useRouteHelpers(route?: ExtendedRoute | null): RouteHelpers | null {

    if (!route) return null;

    const isStepCompleted = (stepId: string) => {
        const currentStepIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
        const step = route.nodes.find(node => node.id === stepId);
        if (!step) return false;
        // if the step has a state, and its completed, return true
        if (step.state) return step.state === StepState.Completed;
        // if the step does not have a state, and its before the current step, assume it is completed
        if (currentStepIndex > route.nodes.findIndex(node => node.id === stepId)) return true;
        return false;
    }

    const isStepFailed = (stepId: string) => {
        const step = route.nodes.find(node => node.id === stepId);
        if (!step) return false;
        // if the step has a state, and its failed, return true
        if (step.state) return step.state === StepState.Failed;
        return false;
    }

    const isRouteCompleted = () => route.state === RouteState.Completed;
    const isRouteStopped = () => route.state === RouteState.Stopped;
    const isRoutePaused = () => route.state === RouteState.Paused;
    const isRouteIdle = () => route.state === RouteState.Idle;
    const isRouteStarted = () => route.state === RouteState.Started;
    const isCurrentStep = (stepId: string) => route.currentStepId === stepId;

    const isPreviousStep = (stepId: string) => {
        const currentIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
        return route.nodes[currentIndex - 1]?.id === stepId;
    }

    const isNextStep = (stepId: string) => {
        const currentIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
        return route.nodes[currentIndex + 1]?.id === stepId;
    }

    const isRedoStep = (stepId: string) => {
        const currentIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
        return route.nodes[currentIndex]?.id === stepId;
    }

    const isOnLastStep = () => {
        return route.nodes.findIndex(node => node.id === route.currentStepId) === route.nodes.length - 1;
    }

    const isLastStep = (stepId: string) => {
        return route.nodes.findIndex(node => node.id === stepId) === route.nodes.length - 1;
    }

    return {
        isStepCompleted,
        isStepFailed,
        isRouteCompleted,
        isRouteStopped,
        isRoutePaused,
        isRouteIdle,
        isRouteStarted,
        isCurrentStep,
        isPreviousStep,
        isNextStep,
        isRedoStep,
        isOnLastStep,
        isLastStep,
    };
}