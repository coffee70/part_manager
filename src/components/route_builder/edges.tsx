'use client'
import { useBuilderContext } from "./builder.context";
import { Edge } from "./types";

export default function Edges() {
    const { route } = useBuilderContext();
    return (
        <svg className="absolute z-0 overflow-visible pointer-events-none" width="100%" height="100%">
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
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
        />
    )
}

function Use({ edge }: { edge: Edge }) {
    const { setSelectedEdge } = useBuilderContext();

    const onClick = (e: React.MouseEvent<SVGUseElement>) => {
        e.stopPropagation();
        setSelectedEdge(edge);
    }

    return (
        <use
            href={`#${edge.id}`}
            fill="none"
            stroke="black"
            strokeWidth="2"
            onClick={onClick}
        />
    )
}