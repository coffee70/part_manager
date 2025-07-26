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

export default function StepFilterBase() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const urlSteps = searchParams.getAll('step');
    const urlRouteStatus = searchParams.getAll('route-status');

    const { id } = useInstanceURL();
    const queryClient = useQueryClient();

    const { data, isPending, isError } = useQuery({
        queryKey: routeKeys.currentSteps(id),
        queryFn: () => getCurrentSteps({ modelId: id })
    })

    const handleStepChange = (instanceId: string) => {
        const params = new URLSearchParams(searchParams);
        if (urlSteps.includes(instanceId)) {
            params.delete('step', instanceId);
        } else {
            params.append('step', instanceId);
        }
        queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", id) });
        replace(`${pathname}?${params.toString()}`);
    }

    const handleRouteStatusChange = (routeStatus: RouteState) => {
        const params = new URLSearchParams(searchParams);
        if (urlRouteStatus.includes(routeStatus)) {
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
                    className="flex items-center justify-between"
                >
                    <StepBadge step={{
                        id: step.instanceId,
                        name: step.number,
                        type: step.type
                    }} />
                    <CheckIcon className={cn(urlSteps.includes(step.instanceId) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
            {data.includeDone && (
                <SelectItem onClick={() => handleRouteStatusChange(RouteState.Completed)} className="flex items-center justify-between">
                    <StepBadge step={{
                        id: RouteState.Completed,
                        name: "Done",
                        type: "Done"
                    }} />
                    <CheckIcon className={cn(urlRouteStatus.includes(RouteState.Completed) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            )}
            {data.includePaused && (
                <SelectItem onClick={() => handleRouteStatusChange(RouteState.Paused)} className="flex items-center justify-between">
                    <Badge label={"PAUSED"} className="border border-stone-500 text-stone-500 px-2" />
                    <CheckIcon className={cn(urlRouteStatus.includes(RouteState.Paused) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            )}
            {data.includeNotStarted && (
                <SelectItem onClick={() => handleRouteStatusChange(RouteState.Stopped)} className="flex items-center justify-between">
                    <StepBadge step={{
                        id: RouteState.Stopped,
                        name: "Not Started",
                        type: "To-do"
                    }} />
                    <CheckIcon className={cn(urlRouteStatus.includes(RouteState.Stopped) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            )}
        </SelectBase>
    );
}