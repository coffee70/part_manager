'use client'
import React from 'react';
import { TRACER_POINT_HOVER_HEIGHT, TRACER_POINT_HOVER_WIDTH } from './constants';
import Point from './point';
import { useDrawingViewerContext } from './context';

export default function DimensionTracer() {
    const { pointer } = useDrawingViewerContext();
    const [points, setPoints] = React.useState<{ x: number, y: number }[]>([]);
    
    const handleBoardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Prevent points from being added outside the bounds of the board
        if (x < 0 || y < 0) return;
        if (x > rect.width || y > rect.height) return;

        // Prevent points from being added too close to each other
        if (points.some(point => Math.abs(point.x - x) < TRACER_POINT_HOVER_WIDTH / 2 && Math.abs(point.y - y) < TRACER_POINT_HOVER_HEIGHT / 2)) return;

        setPoints(prev => [...prev, { x, y }]);
    };

    return (
        <div
            className='absolute top-0 left-0 w-full h-full cursor-pointer'
            onClick={handleBoardClick}
        >
            {points.map((point, index) => (
                <Point
                    key={index}
                    point={point}
                    index={index}
                />
            ))}
        </div>
    )
}