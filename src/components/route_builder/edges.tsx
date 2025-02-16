'use client'
import { useBuilderContext } from "./builder.context";

export default function Edges() {
    const { route } = useBuilderContext();
    return (
        <svg className="absolute z-0 overflow-visible pointer-events-none" width="100%" height="100%">
            <defs>
                {route.edges.map((edge, index) => (
                    <path
                        key={index}
                        id={edge.id}
                        d={edge.path}
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                    />
                ))}
            </defs>
            {route.edges.map((edge, index) => (
                <use
                    key={index}
                    href={`#${edge.id}`}
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                />
            ))}
        </svg>
    )
}