import { useBuilderContext } from "./builder.context";
import Node from "./node";
import StartNode from "./start_node";

export default function Nodes() {
    const { nodeRefs, route } = useBuilderContext();
    return (
        <>
            {route.startNode && <StartNode node={route.startNode} />}
            {route.nodes.map((node, index) => (
                <Node
                    key={node.id}
                    node={node}
                    ref={(el) => { nodeRefs.current[index] = el }}
                />
            ))}
        </>
    )
}