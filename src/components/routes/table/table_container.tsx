'use client'
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/list/data_table/table_skeleton";
import RouteTable from "@/components/ui/route_table";
import { RouteState } from "@/types/collections";
import { useRouter } from "next/navigation";
import { router } from "@/lib/url";
import { useRouteActions } from "@/components/routes/hooks/use_route_actions";
import { useRouteHelpers, ExtendedRoute } from "@/components/routes/hooks/use_route_helpers";
import { StepDisplay } from "@/components/routes/table/step_display";
import { StepActionControls } from "@/components/routes/table/step_action_controls";
import { RouteFooter } from "@/components/routes/table/route_footer";
import { RouteHeader } from "@/components/routes/table/route_header";
import RouteNotFound from "./route_not_found";

export default function TableContainer() {
    const { modelId, instanceId } = useModelInstanceRoutingURL();
    const nextRouter = useRouter();

    const { data: route, isPending, isError } = useQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId })
    });

    const {
        handleFailStep,
        handleCompleteStep,
        handleStartRoute: _handleStartRoute,
        handleCompleteRoute: _handleCompleteRoute,
        updateStepMutation,
    } = useRouteActions("models", modelId, instanceId);

    // Use a default route structure for the hook when data is not available
    const routeHelpers = useRouteHelpers(route);

    if (!routeHelpers) return <RouteNotFound />;

    if (isPending) {
        return (
            <div className="p-8">
                <RouteTable>
                    <RouteTable.Body>
                        <div>
                            <TableSkeleton />
                        </div>
                    </RouteTable.Body>
                </RouteTable>
            </div>
        );
    }

    if (isError || !route) return <div>Error...</div>;

    const handleUpdateStep = (stepId: string) => {
        updateStepMutation.mutate({ modelId, instanceId, stepId });
    };

    const handleClick = (stepId: string) => {
        nextRouter.push(router().models().instances().step(modelId, instanceId, stepId));
    };

    const handleStartRoute = () => {
        _handleStartRoute();
        nextRouter.push(router().models().instances().step(modelId, instanceId, route.nodes[0].id));
    };

    const handleCompleteRoute = () => {
        _handleCompleteRoute();
        nextRouter.push(router().models().instances().step(modelId, instanceId, RouteState.Completed));
    };

    return (
        <div className="p-8">
            <RouteTable>
                <RouteTable.Body>
                    <RouteHeader
                        routeHelpers={routeHelpers}
                        onStartRoute={handleStartRoute}
                    />
                    {route.nodes.map(node => (
                        <RouteTable.Row
                            key={node.id}
                            onClick={() => handleClick(node.id)}
                        >
                            <StepDisplay
                                stepId={node.id}
                                stepName={node.name}
                                routeHelpers={routeHelpers}
                                route={route}
                            />
                            <StepActionControls
                                stepId={node.id}
                                routeHelpers={routeHelpers}
                                route={route}
                                onUpdateStep={handleUpdateStep}
                                onFailStep={handleFailStep}
                                onCompleteStep={handleCompleteStep}
                            />
                        </RouteTable.Row>
                    ))}
                    <RouteFooter
                        routeHelpers={routeHelpers}
                        onCompleteRoute={handleCompleteRoute}
                    />
                </RouteTable.Body>
            </RouteTable>
        </div>
    );
}
