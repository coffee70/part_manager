import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRouteState } from "@/server/routes/update_route_state";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import Loader from "@/components/ui/loader";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { RouteState } from "@/components/route_builder/list_view/types";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const StartRoute = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateRouteState,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
            queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
            queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
            // invalidate table view
            queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", modelId) });
        }
    })

    const handleClick = () => {
        mutate({
            modelId,
            instanceId,
            state: RouteState.Started
        })
    }

    return (
        <Button
            ref={ref}
            variant='secondary'
            className="py-4 px rounded-sm border text-base font-bold bg-transparent text-stone-500 border-stone-500 hover:bg-stone-100"
            onClick={handleClick}
            {...props}
        >
            {isPending ? <Loader /> : <span>Start Route</span>}
        </Button>
    );
});

StartRoute.displayName = 'StartRoute';

export default StartRoute;