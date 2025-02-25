'use client'
import React from "react";
import { Endpoint, Node, HandlePosition, Route, StartNode, Edge } from "./types";
import { calculatePath } from "./edgelib/smooth_step";
import { useQuery } from "@tanstack/react-query";
import { useAdminURL } from "@/hooks/url_metadata.hook";
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";
import { calculateNodePosition } from "./nodelib";
import { START_NODE_ID } from "./start_node";
import { useNotifications } from "./notifications/notification.hook";

const START_EDGE_ID = 'start-edge';

export function useRoute() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // notifications
    const {
        notification,
        isNotifying,
        notify,
    } = useNotifications();

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
        startNode: undefined,
        startEdge: undefined,
    });

    React.useEffect(() => {
        if (initialRoute) {
            setRoute(initialRoute);
        }
    }, [initialRoute]);

    const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const [isEditing, setIsEditing] = React.useState(false);
    const [isAddingEdges, setIsAddingEdges] = React.useState(false);

    const hasStartNode = React.useCallback(() => route.startNode !== undefined, [route.startNode]);

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

    const addStartNode = (startNode: StartNode) => {
        setRoute((prevRoute) => {
            const updatedRoute = {
                ...prevRoute,
                startNode,
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
        sourcePosition: HandlePosition,
        targetId: string,
        targetPosition: HandlePosition,
    ) => {
        // check if target is start node
        if (targetId === START_NODE_ID) {
            notify({
                message: 'Start node cannot be a target!',
                type: 'error',
            })
            return;
        }

        // you can't add an edge from a node to itself
        if (sourceId === targetId) {
            notify({
                message: 'Cannot add edge from a step to itself!',
                type: 'error',
            })
            return;
        }

        setRoute((prevRoute) => {
            // start edge
            if (sourceId === START_NODE_ID) {
                const updatedRoute = {
                    ...prevRoute,
                    startEdge: {
                        id: START_EDGE_ID,
                        sourceId,
                        sourcePosition,
                        targetId,
                        targetPosition,
                        path: calculatePath(
                            containerRef,
                            sourceId,
                            sourcePosition,
                            targetId,
                            targetPosition,
                        ),
                    },
                };
                return updatedRoute;
            }

            // regular edge
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
                        path: calculatePath(
                            containerRef,
                            sourceId,
                            sourcePosition,
                            targetId,
                            targetPosition,
                        ),
                    },
                ],
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, [containerRef]);

    const updateNodeLocation = React.useCallback((target: Element) => {
        const nodeId = target.getAttribute('id');

        // start node
        if (nodeId === START_NODE_ID) {
            setRoute((prevRoute) => {
                const updatedRoute: Route = {
                    ...prevRoute,
                    startEdge: prevRoute.startEdge ? {
                        ...prevRoute.startEdge,
                        path: calculatePath(
                            containerRef,
                            START_NODE_ID,
                            prevRoute.startEdge.sourcePosition,
                            prevRoute.startEdge.targetId,
                            prevRoute.startEdge.targetPosition,
                        )
                    } : undefined,
                    startNode: prevRoute.startNode ?{
                        ...prevRoute.startNode,
                        ...calculateNodePosition({
                            target,
                            containerRef,
                        }),
                    } : undefined,
                }
                return updatedRoute;
            })
            return;
        }

        // regular nodes
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
                startEdge: prevRoute.startEdge?.targetId === nodeId ? {
                    ...prevRoute.startEdge,
                    path: calculatePath(
                        containerRef,
                        prevRoute.startEdge.sourceId,
                        prevRoute.startEdge.sourcePosition,
                        prevRoute.startEdge.targetId,
                        prevRoute.startEdge.targetPosition,
                    ),
                } : prevRoute.startEdge,
            };
            return updatedRoute;
        });
        setIsEditing(true);
    }, [containerRef]);

    const removeEdge = (id: string) => {
        setRoute((prevRoute) => {
            // start edge
            if (id === START_EDGE_ID) {
                const updatedRoute = {
                    ...prevRoute,
                    startEdge: undefined,
                };
                return updatedRoute
            }
            // regular edge
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

    const removeRoute = () => {
        setRoute({
            nodes: [],
            edges: [],
            startNode: undefined,
            startEdge: undefined,
        });
        setIsEditing(true);
    }

    return {
        containerRef,
        route,
        isEditing,
        isAddingEdges,
        nodeRefs,
        notification,
        isNotifying,
        removeRoute,
        notify,
        setIsEditing,
        addNode,
        addStartNode,
        hasStartNode,
        removeNode,
        updateNode,
        addEdge,
        addEndpoint,
        resetEndpoint,
        updateNodeLocation,
        removeEdge,
    }
}