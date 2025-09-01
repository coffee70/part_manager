'use client'
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { getInstance } from "@/server/instances/get_instance";
import { useQuery } from "@tanstack/react-query";
import { TitleRouterIcon } from "@/components/ui/icons/icons";
import { router } from "@/lib/url";
import { useRouteHelpers } from "@/components/routes/hooks/use_route_helpers";
import { getRoute } from "@/server/routes/get_route";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { AlertCircle } from "lucide-react";
import { HeaderController } from "./header_controller";
import { useRouteActions } from "../hooks/use_route_actions";

export default function Header() {
    const { modelId, instanceId } = useModelInstanceRoutingURL();

    const { data: instance, isPending: isInstancePending, isError: isInstanceError } = useQuery({
        queryKey: instanceKeys.id("models", modelId, instanceId),
        queryFn: () => getInstance({ id: modelId, instanceId }),
    })

    const { data: route, isPending: isRoutePending, isError: isRouteError } = useQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId })
    });

    const routeHelpers = useRouteHelpers(route);

    if (!routeHelpers || !instance || !route) return <div>Error...</div>;
    if (isInstancePending || isRoutePending) return <div>Loading...</div>
    if (isInstanceError || isRouteError) return <div>Error</div>

    const {
        isRoutePaused,
        isRouteStarted
    } = routeHelpers;

    return (
        <div className="flex flex-col space-y-4 py-4 px-8 bg-stone-100 border-b border-stone-300 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <TitleRouterIcon size={40} />
                    <div className="flex flex-col">
                        {/** The padding on the breadcrumb matches the built in padding to the Title component */}
                        <Breadcrumb items={[{
                            label: instance.number,
                            href: router().models().instances().instance(modelId, instanceId)
                        }]} />
                        <span className="text-xl font-bold">Routing</span>
                    </div>
                </div>
                <HeaderController
                    isPaused={isRoutePaused()}
                    isStarted={isRouteStarted()}
                />
            </div>
            {isRoutePaused() && (
                <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        The route is currently paused. Click the play button to resume the route.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}