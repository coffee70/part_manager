import { RouteState, StepState } from "@/types/collections";
import { ActionButton } from "../components/action_button";
import { PauseIcon, PlayIcon, TrashIcon, CircleXIcon } from "lucide-react";
import { useState } from "react";
import StopRouteDialog from "../components/stop_route_dialog";
import DeleteRouteDialog from "../components/delete_route_dialog";
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { useRouteActions } from "../hooks/use_route_actions";
import { router } from "@/lib/url";
import { useRouter } from "next/navigation";

type HeaderControllerProps = {
    isPaused: boolean;
    isStarted: boolean;
}

export function HeaderController({
    isPaused,
    isStarted,
}: HeaderControllerProps) {
    const { modelId, instanceId } = useModelInstanceRoutingURL();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stopDialogOpen, setStopDialogOpen] = useState(false);

    const nextRouter = useRouter();

    const {
        handlePauseRoute,
        handleResumeRoute,
        handleDeleteRoute,
        handleStopRoute,
        deleteRouteMutation,
        updateRouteStateMutation,
    } = useRouteActions("models", modelId, instanceId);

    const handleConfirmStopRoute = () => {
        handleStopRoute();
        setStopDialogOpen(false);
        nextRouter.push(router().models().instances().step(modelId, instanceId, RouteState.Stopped));
    }

    const handleConfirmDeleteRoute = () => {
        handleDeleteRoute();
        setDeleteDialogOpen(false);
        // now the route is deleted so redirect back to the model instance
        const redirectUrl = router().models().instances().instance(modelId, instanceId);
        nextRouter.push(redirectUrl);
    }

    return (
        <div className="flex items-center space-x-3">
            {isStarted && !isPaused && <ActionButton
                icon={PauseIcon}
                label="Pause Route"
                onClick={handlePauseRoute}
                state={StepState.NotStarted}
            />}
            {isPaused && <ActionButton
                icon={PlayIcon}
                label="Resume Route"
                onClick={handleResumeRoute}
                state={StepState.NotStarted}
            />}
            <ActionButton
                icon={CircleXIcon}
                label="Stop Route"
                onClick={() => setStopDialogOpen(true)}
                state={StepState.Failed}
            />
            <ActionButton
                icon={TrashIcon}
                label="Delete Route"
                onClick={() => setDeleteDialogOpen(true)}
                state={StepState.Failed}
            />

            <DeleteRouteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onDelete={handleConfirmDeleteRoute}
                isPending={deleteRouteMutation.isPending}
                isError={deleteRouteMutation.isError}
                error={deleteRouteMutation.error}
            />

            <StopRouteDialog
                open={stopDialogOpen}
                onOpenChange={setStopDialogOpen}
                onStop={handleConfirmStopRoute}
                isPending={updateRouteStateMutation.isPending}
                isError={updateRouteStateMutation.isError}
                error={updateRouteStateMutation.error}
            />
        </div>
    );
}
