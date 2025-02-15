'use client'
import React from "react";
import { Endpoint, Node, Position, Route } from "./types";
import { calculatePath } from "./edge";

export function useRoute({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLDivElement>;
}) {
    const [route, setRoute] = React.useState<Route>([]);

    const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const [isEditing, setIsEditing] = React.useState(false);
    const [isAddingEdges, setIsAddingEdges] = React.useState(false);

    const addNode = React.useCallback((node: Node) => {
        setRoute((prevRoute) => [...prevRoute, node]);
        setIsEditing(true);
    }, []);

    const removeNode = React.useCallback((id: string) => {
        setRoute((prevRoute) => prevRoute.filter(node => node.id !== id));
        setIsEditing(true);
    }, []);

    const updateNode = React.useCallback((updatedNode: Node) => {
        setRoute((prevRoute) => prevRoute.map(node => node.id === updatedNode.id ? updatedNode : node));
        setIsEditing(true);
    }, []);

    const addEdge = React.useCallback((
        sourceId: string, 
        sourcePosition: Position,
        targetId: string,
        targetPosition: Position,
    ) => {
        setRoute((prevRoute) => {
            const updatedRoute = prevRoute.map(node => {
                if (node.id === sourceId) {
                    return {
                        ...node,
                        edges: [
                            ...node.edges, 
                            { 
                                sourcePosition, 
                                targetId,
                                targetPosition,
                                path: calculatePath(
                                    containerRef,
                                    node.id,
                                    sourcePosition,
                                    targetId,
                                    targetPosition,
                                ),
                            }
                        ],
                    };
                }
                return node;
            });
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const updateEdges = React.useCallback((target: Element) => {
        const nodeId = target.getAttribute('id');
        setRoute(prevRoute => {
            const updatedRoute = prevRoute.map(node => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        edges: node.edges.map(edge => {
                            const path = calculatePath(
                                containerRef,
                                node.id,
                                edge.sourcePosition,
                                edge.targetId,
                                edge.targetPosition,
                            );
                            return { ...edge, path };
                        }),
                    };
                }
                return node;
            })
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const removeEdge = React.useCallback((sourceId: string, targetId: string) => {
        setRoute((prevRoute) => {
            const updatedRoute = prevRoute.map(node => {
                if (node.id === sourceId) {
                    return {
                        ...node,
                        edges: node.edges.filter(edge => edge.targetId !== targetId),
                    };
                }
                return node;
            });
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const [endpoint, setEndpoint] = React.useState<Endpoint>();

    const addEndpoint = React.useCallback(({
        id,
        position,
    }: Endpoint) => {
        if (endpoint === undefined) {
            setEndpoint({
                id,
                position,
            });
            setIsAddingEdges(true);
        }
        else {
            addEdge(
                endpoint.id,
                endpoint.position,
                id,
                position,
            )
            setEndpoint(undefined);
            setIsEditing(true);
            setIsAddingEdges(false);
        }
    },[endpoint, addEdge]);

    return {
        route,
        isEditing,
        isAddingEdges,
        nodeRefs,
        addNode,
        removeNode,
        updateNode,
        addEdge,
        addEndpoint,
        updateEdges,
        removeEdge,
    }
}