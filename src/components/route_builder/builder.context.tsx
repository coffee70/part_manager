'use client'
import React from 'react';
import { useRoute } from './route.hook';
import { Endpoint, Route, Node, Edge } from './types';

type Item = {
    id: string;
    type: 'node' | 'edge';
}

type BuilderContextType = {
    isAddingEdges: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
    nodeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
    route: Route;
    addEndpoint: ({ id, position, }: Endpoint) => void
    resetEndpoint: () => void
    addNode: (node: Node) => void
    updateNode: (updatedNode: Node) => void
    updateEdges: (target: Element) => void
    setSelectedNode: (node: Node | null) => void
    setSelectedEdge: (edge: Edge | null) => void
    isNodeSelected: (node: Node) => boolean
    isEdgeSelected: (edge: Edge) => boolean
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
    const containerRef = React.useRef<HTMLDivElement>(null);

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

    const {
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
    } = useRoute({ containerRef });

    const value = {
        isAddingEdges,
        containerRef,
        nodeRefs,
        route,
        addEndpoint,
        resetEndpoint,
        addNode,
        updateNode,
        updateEdges,
        setSelectedNode,
        setSelectedEdge,
        isNodeSelected,
        isEdgeSelected,
    }

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    )
}