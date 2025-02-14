'use client'
import React from 'react';
import { STAGE_BORDER_WIDTH } from './stage';

export type GetControlWithCurvatureParams = {
    pos: Position;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    c?: number;
};

export enum Position {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
}

export type Edge = {
    id: string;
    sourceId: string;
    sourcePosition: Position;
    targetId: string;
    targetPosition: Position;
    path: string;
}

function calculateControlOffset(distance: number, curvature: number): number {
    if (distance >= 0) {
        return 0.5 * distance;
    }

    return curvature * 25 * Math.sqrt(-distance);
}

function getControlWithCurvature({ pos, x1, y1, x2, y2, c = 0.25 }: GetControlWithCurvatureParams): [number, number] {
    switch (pos) {
        case Position.Left:
            return [x1 - calculateControlOffset(x1 - x2, c), y1];
        case Position.Right:
            return [x1 + calculateControlOffset(x2 - x1, c), y1];
        case Position.Top:
            return [x1, y1 - calculateControlOffset(y1 - y2, c)];
        case Position.Bottom:
            return [x1, y1 + calculateControlOffset(y2 - y1, c)];
    }
}

export const useEdges = (containerRef: React.RefObject<HTMLDivElement>) => {
    const [edges, setEdges] = React.useState<Edge[]>([]);

    const updateEdges = React.useCallback((target: Element) => {
        const nodeId = target.getAttribute('id');
        // find all edges that use the nodeId as source or target
        const edgesToUpdate = edges.filter(edge => edge.sourceId === nodeId || edge.targetId === nodeId);
        edgesToUpdate.forEach(edge => {
            const path = calculatePath(
                containerRef,
                edge.sourceId,
                edge.sourcePosition,
                edge.targetId,
                edge.targetPosition,
            );
            setEdges(prevEdges => prevEdges.map(e => e.id === edge.id ? { ...e, path } : e));
        });
    }, [edges, containerRef]);

    return {
        edges,
        setEdges,
        updateEdges,
    }
}

const calculatePath = (
    containerRef: React.RefObject<HTMLDivElement>,
    sourceId: string,
    sourcePosition: Position,
    targetId: string,
    targetPosition: Position,
) => {
    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);
    if (!source || !target) {
        return '';
    }

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) {
        return '';
    }

    const sourceOrigin = {
        x: sourceRect.x + sourceRect.width - containerRect.x - STAGE_BORDER_WIDTH,
        y: sourceRect.y + (sourceRect.height / 2) - containerRect.y - STAGE_BORDER_WIDTH,
    }

    const targetOrigin = {
        x: targetRect.x - containerRect.x - STAGE_BORDER_WIDTH,
        y: targetRect.y + (targetRect.height / 2) - containerRect.y - STAGE_BORDER_WIDTH,
    }

    const [sourceControlX, sourceControlY] = getControlWithCurvature({
        pos: sourcePosition,
        x1: sourceOrigin.x,
        y1: sourceOrigin.y,
        x2: targetOrigin.x,
        y2: targetOrigin.y,
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
        pos: targetPosition,
        x1: targetOrigin.x,
        y1: targetOrigin.y,
        x2: sourceOrigin.x,
        y2: sourceOrigin.y,
    });

    return `M ${sourceOrigin.x} ${sourceOrigin.y} C ${sourceControlX} ${sourceControlY}, ${targetControlX} ${targetControlY}, ${targetOrigin.x} ${targetOrigin.y}`;
};