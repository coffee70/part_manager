import { useBuilderContext } from "./builder.context";
import Node from "./node";

export default function Nodes() {
    const { nodeRefs, route } = useBuilderContext();
    return route.nodes.map((node, index) => (
        <Node
            key={node.id}
            node={node}
            ref={(el) => { nodeRefs.current[index] = el }}
        />
    ))
}