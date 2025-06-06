'use client'
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentSteps } from "@/server/routes/get_current_steps";
import { SelectBase, SelectItem } from "@/components/ui/select";
import { StepBadge } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { RouteState } from "@/components/route_builder/list_view/types";

export default function StepFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const initialSteps = searchParams.getAll('step');
    const initialRouteStatus = searchParams.getAll('route-status');

    const { id } = useInstanceURL();
    const queryClient = useQueryClient();

    const { data, isPending, isError } = useQuery({
        queryKey: routeKeys.currentSteps(id),
        queryFn: () => getCurrentSteps({ modelId: id })
    })

    const handleStepChange = (instanceId: string) => {
        const params = new URLSearchParams(searchParams);
        if (initialSteps.includes(instanceId)) {
            params.delete('step', instanceId);
        } else {
            params.append('step', instanceId);
        }
        queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", id) });
        replace(`${pathname}?${params.toString()}`);
    }

    const handleRouteStatusChange = (routeStatus: RouteState) => {
        const params = new URLSearchParams(searchParams);
        if (initialRouteStatus.includes(routeStatus)) {
            params.delete('route-status', routeStatus);
        } else {
            params.append('route-status', routeStatus);
        }
        queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", id) });
        replace(`${pathname}?${params.toString()}`);
    }

    if (isPending || isError) return null;

    return (
        <SelectBase>
            {data.steps.map((step) => (
                <SelectItem
                    key={step.instanceId}
                    onClick={() => handleStepChange(step.instanceId)}
                >
                    <StepBadge step={{
                        id: step.instanceId,
                        name: step.number,
                        type: step.type
                    }} />
                    <CheckIcon className={cn(initialSteps.includes(step.instanceId) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
            {data.includeDone && (
                <SelectItem onClick={() => handleRouteStatusChange(RouteState.Completed)}>
                    <StepBadge step={{
                        id: RouteState.Completed,
                        name: "Done",
                        type: "Done"
                    }} />
                    <CheckIcon className={cn(initialRouteStatus.includes(RouteState.Completed) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            )}
            {data.includePaused && (
                <SelectItem onClick={() => handleRouteStatusChange(RouteState.Paused)}>
                    <Badge label={"PAUSED"} className="border border-stone-500 text-stone-500 px-2" />
                    <CheckIcon className={cn(initialRouteStatus.includes(RouteState.Paused) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            )}
            {data.includeNotStarted && (
                <SelectItem onClick={() => handleRouteStatusChange(RouteState.Stopped)}>
                    <StepBadge step={{
                        id: RouteState.Stopped,
                        name: "Not Started",
                        type: "To-do"
                    }} />
                    <CheckIcon className={cn(initialRouteStatus.includes(RouteState.Stopped) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            )}
        </SelectBase>
    );
}