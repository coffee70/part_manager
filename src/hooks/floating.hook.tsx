'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';

export const useFloating = () => {
    const [open, setOpen] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

    const referenceRef = useRef<HTMLElement | null>(null);
    const floatingRef = useRef<HTMLElement | null>(null);

    const setReferenceRef = useCallback((node: HTMLElement | null) => {
        referenceRef.current = node;
        if (node) {
            const rect = node.getBoundingClientRect();
            setCoordinates({
                x: rect.left + window.scrollX + rect.width / 2,
                y: rect.top + window.scrollY + rect.height,
            });
        }
    }, []);

    const setFloatingRef = useCallback((node: HTMLElement | null) => {
        floatingRef.current = node;
        if (node && referenceRef.current) {
            const { x, y } = coordinates;
            const floatingRect = node.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            let adjustedX = x;
            if (x - floatingRect.width / 2 < 0) {
                adjustedX = floatingRect.width / 2;
            } else if (x + floatingRect.width / 2 > viewportWidth) {
                adjustedX = viewportWidth - floatingRect.width / 2;
            }

            node.style.position = 'absolute';
            node.style.left = `${adjustedX}px`;
            node.style.top = `${y}px`;
            node.style.transform = 'translateX(-50%)';
            node.style.zIndex = '1000';
        }
    }, [coordinates]);

    useEffect(() => {
        if (floatingRef.current && referenceRef.current) {
            const { x, y } = coordinates;
            const floatingRect = floatingRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            let adjustedX = x;
            if (x - floatingRect.width / 2 < 0) {
                adjustedX = floatingRect.width / 2;
            } else if (x + floatingRect.width / 2 > viewportWidth) {
                adjustedX = viewportWidth - floatingRect.width / 2;
            }

            floatingRef.current.style.left = `${adjustedX}px`;
            floatingRef.current.style.top = `${y}px`;
        }
    }, [coordinates]);

    const referenceProps = {
        ref: setReferenceRef,
    };

    const floatingProps = {
        ref: setFloatingRef,
    };

    return {
        open,
        setOpen,
        referenceProps,
        floatingProps,
    };
};

export const FloatingExample = () => {
    const { open, setOpen, referenceProps, floatingProps } = useFloating();

    return (
        <div className="flex flex-col items-center">
            <button
                {...referenceProps}
                onClick={() => setOpen(!open)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none"
            >
                Toggle Floating Div
            </button>
            {open && (
                <div
                    {...floatingProps}
                    className="bg-background border border-subtle rounded shadow-lg p-4 w-48 text-center"
                >
                    <p>This is a floating div.</p>
                    <p>It appears below the button.</p>
                </div>
            )}
        </div>
    );
};