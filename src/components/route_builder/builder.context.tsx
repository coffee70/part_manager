'use client'
import React from 'react';
import { Position, Edge, useEdges } from './edge';

type Endpoint = {
    id: string;
    position: Position;
}

type BuilderContextType = {
    addingEdges: boolean;
    setAddingEdges: (addingEdges: boolean) => void;
    resizeObserver: ResizeObserver;
    mutationObserver: MutationObserver;
    edges: Edge[];
    setEndpoint: (endpoint: Endpoint) => void;
    containerRef: React.RefObject<HTMLDivElement>;
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
    const { edges, setEdges, updateEdges } = useEdges(containerRef);

    const [addingEdges, setAddingEdges] = React.useState(false);

    const [endpoint, _setEndpoint] = React.useState<Endpoint>();

    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            updateEdges(entry.target);
        }
    });

    const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                updateEdges(mutation.target as Element);
            }
        }
    });

    const setEndpoint = ({
        id,
        position,
    }: Endpoint) => {
        if (endpoint === undefined) {
            _setEndpoint({
                id,
                position,
            });
        }
        else {
            const newEdge: Edge = {
                id: `${endpoint.id}-${id}`,
                sourceId: endpoint.id,
                sourcePosition: endpoint.position,
                targetId: id,
                targetPosition: position,
                path: '',
            }
            setEdges((prevEdges) => [...prevEdges, newEdge]);
            _setEndpoint(undefined);
            setAddingEdges(false);
        }
    }


    const value = {
        addingEdges,
        setAddingEdges,
        resizeObserver,
        mutationObserver,
        edges,
        setEndpoint,
        containerRef,
    }

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    )
}