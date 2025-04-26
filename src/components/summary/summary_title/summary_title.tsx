import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { useQuery } from "@tanstack/react-query";
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";

export default function SummaryTitle() {

    const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();

    const { data: route, isPending, isError } = useQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId }),
    })

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;

    const title = route?.nodes.find(node => node.id === stepId)?.name ?? '';
    
    return (
        <div>
            <span className="text-3xl font-bold">
                {title}
            </span>
        </div>
    )
}