import { Badge } from "@/components/ui/badge";
import { RouteState } from "@/components/route_builder/list_view/types";
import { StepBadge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { StepType } from "@/types/collections";

type Props = {
    instance: {
        route?: {
            state: RouteState;
            currentStep?: {
                id: string;
                name: string;
                type: StepType;
            };
        }
    }
}

export default function Step({ instance }: Props) {
    return instance.route &&
        (instance.route.state === RouteState.Stopped ? (
            <TableCell align="left">
                <StepBadge step={{
                    id: "not-started",
                    name: "Not Started",
                    type: "To-do"
                }} />
            </TableCell>
        ) : instance.route.state === RouteState.Paused ? (
            <TableCell align="left">
                <Badge label={"PAUSED"} className="border border-stone-500 text-stone-500 px-2" />
            </TableCell>
        ) : instance.route.state === RouteState.Completed ? (
            <TableCell align="left">
                <StepBadge step={{
                    id: "done",
                    name: "Done",
                    type: "Done"
                }} />
            </TableCell>
        ) : (
            <TableCell align="left">
                {instance.route.currentStep && <StepBadge step={instance.route.currentStep} />}
            </TableCell>
        ))
}