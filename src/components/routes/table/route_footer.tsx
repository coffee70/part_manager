'use client'
import RouteTable from "@/components/ui/route_table";
import { RouteHelpers } from "@/components/routes/hooks/use_route_helpers";
import { Spacer } from "@/components/routes/components/spacer";
import { CompletedIcon, NotStartedIcon } from "@/components/ui/icons/icons";
import { StepBadge } from "@/components/ui/badge";
import { RouteState, StepState } from "@/types/collections";
import { CompleteRouteController } from "@/components/routes/table/step_controller";

// Component for route footer
export function RouteFooter({ 
    routeHelpers, 
    onCompleteRoute 
}: {
    routeHelpers: RouteHelpers;
    onCompleteRoute: () => void;
}) {
    const { isRouteCompleted, isOnLastStep, isRouteIdle } = routeHelpers;

    return (
        <RouteTable.FooterRow>
            <RouteTable.Cell>
                <Spacer>
                    {isRouteCompleted() ? <CompletedIcon /> : <NotStartedIcon />}
                    <StepBadge
                        step={{
                            id: RouteState.Completed,
                            name: "Done",
                            type: isRouteCompleted() ? StepState.Completed : StepState.NotStarted
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                    />
                </Spacer>
            </RouteTable.Cell>
            {!isRouteCompleted() && isOnLastStep() && isRouteIdle() && (
                <RouteTable.Cell>
                    <CompleteRouteController
                        onCompleteRoute={onCompleteRoute}
                        state={StepState.Completed}
                    />
                </RouteTable.Cell>
            )}
        </RouteTable.FooterRow>
    );
}