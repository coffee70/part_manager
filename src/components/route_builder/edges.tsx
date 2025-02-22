'use client'
import { useBuilderContext } from "./builder.context";
import { Edge, HandlePosition } from "./types";

export default function Edges() {
    const { route } = useBuilderContext();
    return (
        <svg className="z-0 absolute overflow-visible" width="100%" height="100%">
            <defs>
                {route.edges.map((edge, index) => (
                    <Definition key={index} edge={edge} />
                ))}
            </defs>
            {route.edges.map((edge, index) => (
                <Use key={index} edge={edge} />
            ))}
        </svg>
    )
}

function Definition({ edge }: { edge: Edge }) {
    const { isEdgeSelected } = useBuilderContext();
    return (
        <g id={edge.id}>
            <Marker edge={edge} />
            <path
                d={edge.path}
                markerEnd={`url(#arrow-${edge.id})`}
            />
        </g>
    )
}

function Use({ edge }: { edge: Edge }) {
    const { setSelectedEdge, isEdgeSelected } = useBuilderContext();

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEdgeSelected(edge)) {
            setSelectedEdge(edge);
        }
        else {
            setSelectedEdge(null);
        }
    }

    return (
        <>
            {/* Visible element */}
            <use
                className="z-20 cursor-pointer pointer-events-auto"
                href={`#${edge.id}`}
                fill="none"
                stroke={isEdgeSelected(edge) ? "black" : "gray"}
                strokeWidth={isEdgeSelected(edge) ? 3 : 2}
            />
            {/* Invisible click area */}
            <use
                className="z-30 cursor-pointer pointer-events-auto"
                href={`#${edge.id}`}
                fill="transparent"
                strokeWidth="6"
                onClick={onClick}
            />
        </>
    )
}

function Marker({
    edge
}: {
    edge: Edge
}) {
    const { isEdgeSelected } = useBuilderContext();

    let path: string = "";

    switch (edge.targetPosition) {
        case HandlePosition.TopMiddle:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.TopLeft:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.TopRight:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.BottomMiddle:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.BottomLeft:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.BottomRight:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.Right:
            path = "M 0 0 L 10 5 L 0 10 z";
            break;
        case HandlePosition.Left:
            path = "M 0 0 L 0 10 L 10 5 z";
            break;
    }

    return (
        <marker
            id={`arrow-${edge.id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="2"
            markerHeight="2"
            orient="auto-start-reverse"
            fill={isEdgeSelected(edge) ? "black" : "gray"}
        >
            <path d={path} />
        </marker>
    )
}