'use client'
import { useBuilderContext } from "@/components/route_builder/builder.context";
import useDragger from "@/components/route_builder/draggable.hook";
import React, { useImperativeHandle } from "react"
import Handle, { OFFSET } from "./handle";
import { type Node as NodeType, Position } from "./types";
import StepForm from "./step_form";
import { cva } from "class-variance-authority";
import { StepType } from "@/types/collections";

type Variants = {
    variant: {
        [key in StepType]: string
    }
}

const nodeVariants = cva<Variants>(
    "absolute flex items-center justify-center h-8 min-w-24 rounded-md text-xs font-bold cursor-grab select-none",
    {
        variants: {
            variant: {
                "To-do": "bg-gray-100 text-gray-800 border border-gray-600",
                "In-progress": "bg-blue-100 text-blue-800 border border-blue-600",
                "Done": "bg-green-100 text-green-800 border border-green-600",
            }
        }
    }

)

type NodeProps = {
    node: NodeType;
}

const Node = React.forwardRef<HTMLDivElement, NodeProps>(({ node }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const onDoubleClick = React.useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const internalRef = React.useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => {
        if (!internalRef.current) throw new Error("draggableRef is not assigned");
        return internalRef.current;
    });

    const { updateEdges, containerRef } = useBuilderContext();

    useDragger({
        containerRef,
        draggableRef: internalRef,
    });

    // const {
    //     position: activePosition,
    // } = useConnectorHover({ draggableRef: internalRef });

    React.useEffect(() => {
        if (!internalRef.current) throw new Error("draggableRef is not assigned");
        if (!containerRef.current) throw new Error("containerRef is not assigned");

        const element = internalRef.current;

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

        resizeObserver.observe(element);
        mutationObserver.observe(element, {
            attributes: true,
        });

        return () => {
            resizeObserver.unobserve(element);
            mutationObserver.disconnect();
        }
    }, [internalRef, containerRef]);

    // hover field
    React.useEffect(() => {
        if (!internalRef.current) throw new Error("draggableRef is not assigned");
        const rect = internalRef.current.getBoundingClientRect();
        const x = rect.x
        const y = rect.y
        const width = rect.width;
        const height = rect.height;

        const hoverRect = {
            left: x - OFFSET,
            right: x + width + OFFSET,
            top: y - OFFSET,
            bottom: y + height + OFFSET,
        }

        window.addEventListener("mousemove", (e) => {
            if (
                e.x > hoverRect.left
                && e.x < hoverRect.right
                && e.y > hoverRect.top
                && e.y < hoverRect.bottom
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        });
    });

    return (
        <>
            <div
                ref={internalRef}
                id={node.id}
                className={nodeVariants({ variant: node.type })}
                style={{
                    left: node.x,
                    top: node.y,
                }}
                onDoubleClick={onDoubleClick}
            >
                <span>{node.name.toUpperCase()}</span>
                <Handle
                    nodeId={node.id}
                    position={Position.Left}
                    nodeRef={internalRef}
                    isNodeHovered={isHovered}
                />
                <Handle
                    nodeId={node.id}
                    position={Position.Right}
                    nodeRef={internalRef}
                    isNodeHovered={isHovered}
                />
                <Handle
                    nodeId={node.id}
                    position={Position.Top}
                    nodeRef={internalRef}
                    isNodeHovered={isHovered}
                />
                <Handle
                    nodeId={node.id}
                    position={Position.Bottom}
                    nodeRef={internalRef}
                    isNodeHovered={isHovered}
                />
            </div>

            <StepForm
                step={node}
                open={open}
                setOpen={setOpen}
            />
        </>
    )
})

Node.displayName = "Node";

export default Node;