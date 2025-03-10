'use client'
import React from 'react';
import { useRoute } from './route.hook';
import { Endpoint, Route, Node, Edge, Notification, StartNode } from './types';

type Item = {
    id: string;
    type: 'node' | 'edge';
}

type BuilderContextType = {
    isAddingEdges: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
    nodeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    route: Route;
    isEditing: boolean;
    notification: Notification | null;
    isNotifying: boolean;
    removeRoute: () => void;
    notify: (notification: Notification) => void;
    addEndpoint: ({ id, position, }: Endpoint) => void;
    resetEndpoint: () => void;
    addNode: (node: Node) => void;
    addStartNode: (startNode: StartNode) => void;
    hasStartNode: () => boolean;
    updateNode: (updatedNode: Node) => void;
    updateNodeLocation: (target: Element) => void;
    setSelectedNode: (node: Node | null) => void;
    setSelectedEdge: (edge: Edge | null) => void;
    isNodeSelected: (node: Node) => boolean;
    isEdgeSelected: (edge: Edge) => boolean;
    isItemSelected: () => boolean;
    resetSelectedItem: () => void;
    removeSelectedItem: () => void;
    setIsEditing: (isEditing: boolean) => void;
}

const BuilderContext = React.createContext<BuilderContextType | null>(null);

export const useBuilderContext = () => {
    const context = React.useContext(BuilderContext);
    if (!context) {
        throw new Error('useBuilderContext must be used within a BuilderContext');
    }
    return context;
}
type Props = {
    children: React.ReactNode;
}

export function BuilderProvider({ children }: Props) {

    const {
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
        removeEdge,
        addEndpoint,
        resetEndpoint,
        updateNodeLocation,
    } = useRoute();

    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

    const setSelectedNode = (node: Node | null) => {
        if (!node) {
            setSelectedItem(null);
        } else {
            setSelectedItem({ id: node.id, type: 'node' });
        }
    }

    const setSelectedEdge = (edge: Edge | null) => {
        if (!edge) {
            setSelectedItem(null);
        } else {
            setSelectedItem({ id: edge.id, type: 'edge' });
        }
    }

    const isNodeSelected = (node: Node) => {
        return selectedItem?.type === 'node' && selectedItem.id === node.id;
    }

    const isEdgeSelected = (edge: Edge) => {
        return selectedItem?.type === 'edge' && selectedItem.id === edge.id;
    }

    const isItemSelected = () => {
        return selectedItem !== null;
    }

    const resetSelectedItem = () => {
        setSelectedItem(null);
    }

    const removeSelectedItem = () => {
        if (!selectedItem) return;
        if (selectedItem.type === 'node') {
            setSelectedNode(null);
            removeNode(selectedItem.id);
        } else if (selectedItem.type === 'edge') {
            setSelectedEdge(null);
            removeEdge(selectedItem.id);
        }
    }

    const value = {
        isAddingEdges,
        containerRef,
        nodeRefs,
        route,
        isEditing,
        notification,
        isNotifying,
        removeRoute,
        notify,
        addEndpoint,
        resetEndpoint,
        addNode,
        addStartNode,
        hasStartNode,
        updateNode,
        updateNodeLocation,
        setSelectedNode,
        setSelectedEdge,
        isNodeSelected,
        isEdgeSelected,
        isItemSelected,
        resetSelectedItem,
        removeSelectedItem,
        setIsEditing,
    }

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    )
}