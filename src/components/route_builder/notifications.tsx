'use client'
import React from "react";
import { useBuilderContext } from "./builder.context"
import Success from "./notifications/success";

const OFFSET = 20;

export default function Notifications() {
    const notificationRef = React.useRef<HTMLDivElement>(null);
    const { containerRef } = useBuilderContext();

    React.useEffect(() => {
        const container = containerRef.current;
        const notificationEl = notificationRef.current;
        if (!container || !notificationEl) return;

        const containerRect = container.getBoundingClientRect();
        const notificationRect = notificationEl.getBoundingClientRect();

        notificationEl.style.left = `${(containerRect.width / 2) - (notificationRect.width / 2)}px`;
        notificationEl.style.top = `${OFFSET}px`;
    })

    return (
        <div ref={notificationRef} className="absolute">
            <Success />
        </div>
    )
}