'use client'
import { useBuilderContext } from "@/components/route_builder/builder_view/builder.context";
import useDragger from "@/components/route_builder/builder_view/draggable.hook";
import React, { useImperativeHandle } from "react"
import { type Node as NodeType } from "./types";
import StepForm from "./step_form";
import { cva } from "class-variance-authority";
import { StepState } from "@/types/collections";
import { useHoverField } from "./hover_field.hook";
import { useObserver } from "./observer.hook";
import { STAGE_BORDER_WIDTH } from "./stage";
import Handles from "./handles";

type SelectedType = StepState | "None";

type Variants = {
    variant: {
        [key in StepState]: string
    };
    selected: {
        [key in SelectedType]: string;
    }
    dragging: {
        [key in 'true' | 'false']: string;
    }
}

const nodeVariants = cva<Variants>(
    "absolute z-10 flex items-center justify-center h-8 min-w-24 px-1 rounded-md text-xs font-bold select-none",
    {
        variants: {
            variant: {
                [StepState.NotStarted]: "bg-background text-text border border-subtle",
                [StepState.InProgress]: "bg-blue-100 text-blue-800 border border-blue-600",
                [StepState.Completed]: "bg-green-100 text-green-800 border border-green-600",
                [StepState.Failed]: "bg-red-100 text-red-800 border border-red-600",
            },
            selected: {
                [StepState.NotStarted]: "ring-2 ring-border-strong",
                [StepState.InProgress]: "ring-2 ring-blue-600",
                [StepState.Completed]: "ring-2 ring-green-600",
                [StepState.Failed]: "ring-2 ring-red-600",
                "None": "ring-0",
            },  
            dragging: {
                true: "cursor-grabbing",
                false: "cursor-grab",
            }
        },
        defaultVariants: {
            variant: StepState.NotStarted,
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
        lastX: node.x,
        lastY: node.y
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

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
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
                    dragging: isDragging
                })}
                style={{
                    left: node.x - STAGE_BORDER_WIDTH,
                    top: node.y - STAGE_BORDER_WIDTH,
                }}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            >
                <span>{node.name.toUpperCase()}</span>
                <Handles
                    nodeId={node.id}
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