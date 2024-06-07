'use client'
import React from 'react';
import { TRACER_POINT_HOVER_HEIGHT, TRACER_POINT_HOVER_WIDTH } from './constants';
import Point from './point';
import { useDrawingViewerContext } from './context';
import { cn } from '@/lib/utils';

export default function DimensionTracer() {
    const { pointer } = useDrawingViewerContext();
    const [points, setPoints] = React.useState<{ x: number, y: number }[]>([]);
    
    const handleBoardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // if pointer is select, do nothing
        if (pointer === 'select') return;

        // Prevent points from being added outside the bounds of the board
        if (x < 0 || y < 0) return;
        if (x > rect.width || y > rect.height) return;

        // look for nearby points to delete or add
        const neighbor = points.find(point => Math.abs(point.x - x) < TRACER_POINT_HOVER_WIDTH / 2 && Math.abs(point.y - y) < TRACER_POINT_HOVER_HEIGHT / 2)

        // handle delete
        if (neighbor && pointer === 'delete') {
            setPoints(prev => prev.filter(point => point !== neighbor))
            return
        }

        // handle add
        if (!neighbor && pointer === 'add') {
            setPoints(prev => [...prev, { x, y }])
            return
        }
    };

    return (
        <div
            className={cn('absolute top-0 left-0 w-full h-full', pointer === 'add' ? 'cursor-crosshair' : pointer === 'select' ? 'cursor-pointer' : 'cursor-default')}
            onClick={handleBoardClick}
        >
            {points.map((point, index) => (
                <Point
                    key={index}
                    point={point}
                />
            ))}
        </div>
    )
}