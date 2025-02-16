'use client'
import React from "react";
import { Endpoint, Node, Position, Route } from "./types";
import { calculatePath } from "./edge";

export function useRoute({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLDivElement>;
}) {
    const [route, setRoute] = React.useState<Route>({
        nodes: [],
        edges: [],
    });

    React.useEffect(() => {
        console.log("Route", route);
    }, [route]);

    const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const [isEditing, setIsEditing] = React.useState(false);
    const [isAddingEdges, setIsAddingEdges] = React.useState(false);

    const addNode = React.useCallback((node: Node) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                nodes: [...prevRoute.nodes, node],
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const removeNode = React.useCallback((id: string) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                nodes: prevRoute.nodes.filter(node => node.id !== id),
                edges: prevRoute.edges.filter(edge => edge.sourceId !== id && edge.targetId !== id),
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const updateNode = React.useCallback((updatedNode: Node) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                nodes: prevRoute.nodes.map(node => {
                    if (node.id === updatedNode.id) {
                        return {
                            ...node,
                            ...updatedNode,
                        };
                    }
                    return node;
                }),
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const addEdge = React.useCallback((
        sourceId: string,
        sourcePosition: Position,
        targetId: string,
        targetPosition: Position,
    ) => {
        // you can't add an edge from a node
        // to itself in the same position
        if (sourceId === targetId && sourcePosition === targetPosition) return;

        const path = calculatePath(
            containerRef,
            sourceId,
            sourcePosition,
            targetId,
            targetPosition,
        );

        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                edges: [
                    ...prevRoute.edges,
                    {
                        id: crypto.randomUUID(),
                        sourceId,
                        sourcePosition,
                        targetId,
                        targetPosition,
                        path,
                    },
                ],
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, [containerRef]);

    const updateEdges = (target: Element) => {
        const nodeId = target.getAttribute('id');
        setRoute((prevRoute) => {
            const node = prevRoute.nodes.find(node => node.id === nodeId);
            if (node === undefined) return prevRoute;
            const edges = prevRoute.edges.filter(edge => edge.sourceId === nodeId || edge.targetId === nodeId);
            const updatedEdges = edges.map(edge => {
                const sourceNode = prevRoute.nodes.find(node => node.id === edge.sourceId);
                const targetNode = prevRoute.nodes.find(node => node.id === edge.targetId);
                if (!sourceNode || !targetNode) return edge;
                const path = calculatePath(
                    containerRef,
                    sourceNode.id,
                    edge.sourcePosition,
                    targetNode.id,
                    edge.targetPosition,
                );
                return {
                    ...edge,
                    path,
                };
            });
            const updatedRoute = {
                ...prevRoute,
                edges: prevRoute.edges.map(edge => {
                    const updatedEdge = updatedEdges.find(updatedEdge => updatedEdge.id === edge.id);
                    if (updatedEdge) {
                        return updatedEdge;
                    }
                    return edge;
                }),
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }

    const removeEdge = React.useCallback((id: string) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                edges: prevRoute.edges.filter(edge => edge.id !== id),
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, []);

    const [endpoint, setEndpoint] = React.useState<Endpoint>();

    React.useEffect(() => {
        console.log("Endpoints", endpoint);
    }, [endpoint]);

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
    }, [endpoint, addEdge]);

    const resetEndpoint = React.useCallback(() => {
        setEndpoint(undefined);
        setIsAddingEdges(false);
    }, []);

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
        resetEndpoint,
        updateEdges,
        removeEdge,
    }
}