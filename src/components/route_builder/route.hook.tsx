'use client'
import React from "react";
import { Endpoint, Node, Position, Route } from "./types";
import { calculatePath } from "./edge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { upsertRoute } from "@/server/routes/upsert_route";
import { useAdminURL } from "@/hooks/url_metadata.hook";
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";
import { calculateNodePosition } from "./nodelib";

export function useRoute() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const { modelId } = useAdminURL();

    const { data: initialRoute } = useQuery({
        queryKey: routeKeys.id(modelId),
        queryFn: () => getRoute({
            modelId: modelId ?? undefined,
        })
    })

    const [route, setRoute] = React.useState<Route>(initialRoute ?? {
        nodes: [],
        edges: [],
    });

    React.useEffect(() => {
        if (initialRoute) {
            setRoute(initialRoute);
        }
    }, [initialRoute]);

    const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const [isEditing, setIsEditing] = React.useState(false);
    const [isAddingEdges, setIsAddingEdges] = React.useState(false);

    const addNode = (node: Node) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                nodes: [...prevRoute.nodes, node],
            };
            return updatedRoute;
        });
        setIsEditing(true);
    };

    const removeNode = (id: string) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                nodes: prevRoute.nodes.filter(node => node.id !== id),
                edges: prevRoute.edges.filter(edge => edge.sourceId !== id && edge.targetId !== id),
            };
            return updatedRoute;
        });
        setIsEditing(true);
    };

    const updateNode = (updatedNode: Node) => {
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
    }

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

    const updateNodeLocation = React.useCallback((target: Element) => {
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
                nodes: prevRoute.nodes.map(node => {
                    if (node.id === nodeId) {
                        console.log('updateNodeLocation: current state node position', node.x, node.y);
                        console.log('updateNodeLocation: updated node position', target.getBoundingClientRect().x, target.getBoundingClientRect().y);
                        return {
                            ...node,
                            ...calculateNodePosition({
                                target,
                                containerRef,
                            }),
                        };
                    }
                    return node;
                }),
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
    }, [containerRef]);

    const removeEdge = (id: string) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                edges: prevRoute.edges.filter(edge => edge.id !== id),
            };
            return updatedRoute;
        });
        setIsEditing(true);
    };

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
    }, [endpoint, addEdge]);

    const resetEndpoint = React.useCallback(() => {
        setEndpoint(undefined);
        setIsAddingEdges(false);
    }, []);

    const [saveSuccess, setSaveSuccess] = React.useState(false);

    React.useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => {
                setSaveSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess]);

    const { mutate: save } = useMutation({
        mutationFn: upsertRoute,
        onSuccess: (data) => {
            if (data.success) {
                setIsEditing(false);
                setSaveSuccess(true);
            }
            else {
                console.error(data.error)
            }
        }
    })

    const saveRoute = () => {
        save({
            modelId: modelId ?? undefined,
            route,
        });
    }

    return {
        containerRef,
        route,
        isEditing,
        isAddingEdges,
        nodeRefs,
        saveSuccess,
        addNode,
        removeNode,
        updateNode,
        addEdge,
        addEndpoint,
        resetEndpoint,
        updateNodeLocation,
        removeEdge,
        saveRoute,
    }
}