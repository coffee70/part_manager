'use client'
import React from "react";
import { useBuilderContext } from "../builder.context"
import Success from "./success";
import Error from "./error";

const OFFSET = 20;

export default function Notifications() {
    const successRef = React.useRef<HTMLDivElement>(null);
    const errorRef = React.useRef<HTMLDivElement>(null);

    const { containerRef, isNotifying } = useBuilderContext();

    React.useEffect(() => {
        const container = containerRef.current;
        const successEl = successRef.current;
        const errorEl = errorRef.current;
        if (!container || !successEl || !errorEl) return;

        const containerRect = container.getBoundingClientRect();
        const successRect = successEl.getBoundingClientRect();
        const errorRect = errorEl.getBoundingClientRect();

        successEl.style.left = `${(containerRect.width / 2) - (successRect.width / 2)}px`;
        successEl.style.top = `${OFFSET}px`;

        errorEl.style.left = `${(containerRect.width / 2) - (errorRect.width / 2)}px`;
        errorEl.style.top = `${OFFSET}px`;
    }, [containerRef, successRef, isNotifying]);

    return (
        <>
            <Success ref={successRef} />
            <Error ref={errorRef} />
        </>
    )
}