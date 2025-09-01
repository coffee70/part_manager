'use client'
import RouteTable from "@/components/ui/route_table";
import { RouteHelpers } from "@/components/routes/hooks/use_route_helpers";
import { Spacer } from "@/components/routes/components/spacer";
import Pulse from "@/components/ui/pulse";
import { CompletedIcon } from "@/components/ui/icons/icons";
import { StepBadge } from "@/components/ui/badge";
import { RouteState, StepState } from "@/types/collections";
import { NotStartedController } from "@/components/routes/table/step_controller";

// Component for route header
export function RouteHeader({ 
    routeHelpers, 
    onStartRoute 
}: {
    routeHelpers: RouteHelpers;
    onStartRoute: () => void;
}) {
    const { isRouteStopped } = routeHelpers;

    return (
        <RouteTable.HeaderRow>
            <RouteTable.Cell>
                <Spacer>
                    {isRouteStopped() ? <Pulse /> : <CompletedIcon />}
                    <StepBadge
                        step={{
                            id: RouteState.Stopped,
                            name: "Not Started",
                            type: isRouteStopped() ? StepState.NotStarted : StepState.Completed
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                    />
                </Spacer>
            </RouteTable.Cell>
            <RouteTable.Cell>
                {isRouteStopped() && (
                    <NotStartedController
                        onStartRoute={onStartRoute}
                        state={StepState.Completed}
                    />
                )}
            </RouteTable.Cell>
        </RouteTable.HeaderRow>
    );
}