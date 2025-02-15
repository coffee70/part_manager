'use client'
import React from 'react';
import { useRoute } from './route.hook';
import { Endpoint, Route, Node } from './types';

type BuilderContextType = {
    isAddingEdges: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
    nodeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
    route: Route;
    addEndpoint: ({ id, position, }: Endpoint) => void
    addNode: (node: Node) => void
    updateNode: (updatedNode: Node) => void
    updateEdges: (target: Element) => void
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
        updateEdges,
        removeEdge,
    } = useRoute({ containerRef });

    const value = {
        isAddingEdges,
        containerRef,
        nodeRefs,
        route,
        addEndpoint,
        addNode,
        updateNode,
        updateEdges,
    }

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    )
}