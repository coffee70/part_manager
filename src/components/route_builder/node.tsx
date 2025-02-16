'use client'
import { useBuilderContext } from "@/components/route_builder/builder.context";
import useDragger from "@/components/route_builder/draggable.hook";
import React, { useImperativeHandle } from "react"
import Handle from "./handle";
import { type Node as NodeType, Position } from "./types";
import StepForm from "./step_form";
import { cva } from "class-variance-authority";
import { StepType } from "@/types/collections";
import { useHoverField } from "./hover_field.hook";
import { useObserver } from "./observer.hook";

type SelectedType = StepType | "None";

type Variants = {
    variant: {
        [key in StepType]: string
    };
    selected: {
        [key in SelectedType]: string;
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
            },
            selected: {
                "To-do": "ring-2 ring-gray-600",
                "In-progress": "ring-2 ring-blue-600",
                "Done": "ring-2 ring-green-600",
                "None": "ring-0",
            }
        },
        defaultVariants: {
            variant: "To-do",
            selected: "None",
        }
    }
)

type NodeProps = {
    node: NodeType;
}

const Node = React.forwardRef<HTMLDivElement, NodeProps>(({ node }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);

    const {
        containerRef,
        setSelectedNode,
        isNodeSelected
    } = useBuilderContext();

    const { isHovered } = useHoverField({
        draggableRef: internalRef,
    });

    const { isDragging } = useDragger({
        containerRef,
        draggableRef: internalRef,
    });

    useImperativeHandle(ref, () => {
        if (!internalRef.current) throw new Error("draggableRef is not assigned");
        return internalRef.current;
    });

    useObserver({
        draggableRef: internalRef,
    })

    const onDoubleClick = () => {
        setOpen((prev) => !prev);
    }

    const onClick = () => {
        if (isDragging) return;
        if (!isNodeSelected(node)) {
            setSelectedNode(node);
        }
        else {
            setSelectedNode(null)
        }
    }

    return (
        <>
            <div
                ref={internalRef}
                id={node.id}
                className={nodeVariants({
                    variant: node.type,
                    selected: isNodeSelected(node) ? node.type : "None",
                })}
                style={{
                    left: node.x,
                    top: node.y,
                }}
                onClick={onClick}
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