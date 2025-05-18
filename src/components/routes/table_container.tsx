'use client'
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { routeKeys } from "@/lib/query_keys";
import { getRoute } from "@/server/routes/get_route";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/components/list/data_table/table_skeleton";
import { StepBadge } from "@/components/ui/badge";
import Pulse from "@/components/ui/pulse";
import RouteTable from "@/components/ui/route_table";
import { CircleCheckIcon } from "lucide-react";
import { RouteState } from "@/components/route_builder/list_view/types";
import { useRouter } from "next/navigation";
import { router } from "@/lib/url";
import React from "react";

export default function TableContainer() {
    const { modelId, instanceId } = useModelInstanceRoutingURL();

    const { data: route, isPending, isError } = useQuery({
        queryKey: routeKeys.id(modelId, instanceId),
        queryFn: () => getRoute({ modelId, instanceId })
    })

    const nextRouter = useRouter();

    if (isPending) return (
        <div className="p-8">
            <RouteTable>
                <RouteTable.Body>
                    <div>
                        <TableSkeleton />
                    </div>
                </RouteTable.Body>
            </RouteTable>
        </div>
    )

    if (isError || !route) return <div>Error...</div>

    const isStepCompleted = (stepId: string) => {
        const stepIndex = route.nodes.findIndex(node => node.id === stepId);
        const currentStepIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
        return stepIndex < currentStepIndex;
    }

    const isRouteCompleted = () => {
        return route.state === RouteState.Completed;
    }

    const isRouteStopped = () => {
        return route.state === RouteState.Stopped;
    }

    const isCurrentStep = (stepId: string) => {
        return route.currentStepId === stepId;
    }

    const handleClick = (stepId: string) => {
        nextRouter.push(router().models().instances().step(modelId, instanceId, stepId))
    }

    return (
        <div className="p-8">
            <RouteTable>
                <RouteTable.Body>
                    <RouteTable.HeaderRow>
                        <RouteTable.Cell>
                            <StepBadge step={{
                                id: RouteState.Stopped,
                                name: "Not Started",
                                type: "To-do"
                            }} />
                        </RouteTable.Cell>
                        <RouteTable.Cell>
                            {isRouteStopped() ? <Pulse /> : <CompletedIcon />}
                        </RouteTable.Cell>
                    </RouteTable.HeaderRow>
                    {route.nodes.map(node => (
                        <React.Fragment key={node.id}>
                            <RouteTable.Row onClick={() => handleClick(node.id)}>
                                <RouteTable.Cell>
                                    <StepBadge step={{
                                        id: node.id,
                                        name: node.name,
                                        type: "In-progress"
                                    }} />
                                </RouteTable.Cell>
                                <RouteTable.Cell>
                                    {isCurrentStep(node.id) ? <Pulse /> :
                                        isStepCompleted(node.id) ? <CompletedIcon /> :
                                            isRouteCompleted() ? <CompletedIcon /> : <></>}
                                </RouteTable.Cell>
                            </RouteTable.Row>
                        </React.Fragment>
                    ))}
                    <RouteTable.FooterRow>
                        <RouteTable.Cell>
                            <StepBadge step={{
                                id: RouteState.Completed,
                                name: "Done",
                                type: "Done"
                            }} />
                        </RouteTable.Cell>
                        <RouteTable.Cell>
                            {isRouteCompleted() ? <CompletedIcon /> : <></>}
                        </RouteTable.Cell>
                    </RouteTable.FooterRow>
                </RouteTable.Body>
            </RouteTable>
        </div>
    )
}

function CompletedIcon() {
    return (
        <CircleCheckIcon
            className="w-6 h-6 fill-green-500 text-stone-50"
            data-testid="completed-icon"
        />
    )
}

