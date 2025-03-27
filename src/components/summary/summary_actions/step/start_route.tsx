import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startRoute } from "@/server/routes/start_route";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import Loader from "@/components/ui/loader";
import { instanceKeys, routeKeys } from "@/lib/query_keys";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const StartRoute = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: startRoute,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: routeKeys.isStarted(modelId, instanceId),
            })
            queryClient.invalidateQueries({
                queryKey: routeKeys.currentStep(modelId, instanceId),
            })
            queryClient.invalidateQueries({
                queryKey: routeKeys.targetSteps(modelId, instanceId),
            })
            queryClient.invalidateQueries({
                queryKey: routeKeys.id(modelId, instanceId),
            })

            // invalidate table view
            queryClient.invalidateQueries({
                queryKey: instanceKeys.all("models", modelId),
            })
        }
    })

    const handleClick = () => {
        mutate({
            modelId,
            instanceId,
        })
    }

    return (
        <Button
            ref={ref}
            variant='secondary'
            className="py-4 px rounded-sm border text-base font-bold"
            onClick={handleClick}
            {...props}
        >
            {isPending ? <Loader /> : <span>Start Route</span>}
        </Button>
    );
});

StartRoute.displayName = 'StartRoute';

export default StartRoute;