'use client'
import { useBuilderContext } from "./builder.context";
import { Edge } from "./types";

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

    return (
        <path
            id={edge.id}
            d={edge.path}
        />
    )
}

function Use({ edge }: { edge: Edge }) {
    const { setSelectedEdge, isEdgeSelected } = useBuilderContext();

    const onClick = (e: React.MouseEvent) => {
        console.log("edge clicked", edge);
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