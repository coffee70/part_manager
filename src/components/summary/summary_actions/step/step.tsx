import { StepType } from "@/types/collections";
import StepButton from "./step_button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import StepItem from "./step_item";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instanceKeys, routeKeys } from "@/lib/query_keys";
import { updateStep } from "@/server/routes/update_step";
import { getCurrentStep } from "@/server/routes/get_current_step";
import { Skeleton } from "@/components/ui/skeleton";
import { hasRoute } from "@/server/routes/has_route";
import { getTargetSteps } from "@/server/routes/get_target_steps";
import { RouteIcon, TrashIcon } from "lucide-react";
import { ListIcon } from "lucide-react";
import { HammerIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { deleteRoute } from "@/server/routes/delete_route";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Loader from "@/components/ui/loader";

export default function Step() {
    const { context, modelId, instanceId } = useInstanceURL();
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Check if context is 'models' and the instance has a route
    const { data: hasRouteData, isLoading: isLoadingHasRoute } = useQuery({
        queryKey: routeKeys.hasRoute(modelId, instanceId),
        queryFn: () => hasRoute({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId,
    });

    // Fetch the current step data only if the instance has a route
    const { data: currentStep, isLoading: isLoadingCurrentStep } = useQuery({
        queryKey: routeKeys.currentStep(modelId, instanceId),
        queryFn: () => getCurrentStep({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId && !!hasRouteData,
    });

    // Fetch possible target steps
    const { data: targetSteps, isLoading: isLoadingTargetSteps } = useQuery({
        queryKey: routeKeys.targetSteps(modelId, instanceId),
        queryFn: () => getTargetSteps({ modelId, instanceId }),
        enabled: context === "models" && !!modelId && !!instanceId && !!hasRouteData,
    });

    const { mutate: updateStepMutate } = useMutation({
        mutationFn: updateStep,
        onSuccess: () => {
            if (context === "models" && modelId && instanceId) {
                queryClient.invalidateQueries({ queryKey: instanceKeys.id("models", modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", modelId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
            }
        }
    });

    // Add mutation for deleting a route
    const { mutate: deleteRouteMutate, isPending: isDeletePending, isError: isDeleteError, error: deleteError } = useMutation({
        mutationFn: deleteRoute,
        onSuccess: () => {
            if (context === "models" && modelId && instanceId) {
                // Invalidate all relevant queries to update the UI
                queryClient.invalidateQueries({ queryKey: instanceKeys.id("models", modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", modelId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.hasRoute(modelId, instanceId) });
                
                // Close the delete dialog
                setDeleteDialogOpen(false);
            }
        }
    });

    const handleStepChange = (id: string) => {
        if (context === "models" && modelId && instanceId) {
            updateStepMutate({
                modelId,
                instanceId,
                stepId: id
            });
        }
    };

    const handleDeleteRoute = () => {
        if (context === "models" && modelId && instanceId) {
            deleteRouteMutate({
                modelId,
                instanceId
            });
        }
    };

    // Return null if not in 'models' context
    if (context !== "models") return null;

    // Return null if hasRoute is false
    if (!isLoadingHasRoute && !hasRouteData) return null;

    // Show loading state
    if (isLoadingHasRoute || isLoadingCurrentStep || isLoadingTargetSteps) {
        return <Skeleton className="h-8 w-24" />;
    }

    if (!currentStep) return null;

    return (
        <>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Route</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this route? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {isDeleteError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {deleteError instanceof Error ? deleteError.message : 'An error occurred'}
                            </AlertDescription>
                        </Alert>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button 
                            onClick={handleDeleteRoute}
                            disabled={isDeletePending}
                            variant="destructive"
                        >
                            {isDeletePending ? <Loader /> : 'Delete'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <StepButton step={currentStep} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuGroup>
                        {targetSteps && targetSteps.length > 0 ? (
                            targetSteps.map((targetStep, index) => (
                                <DropdownMenuItem
                                    key={targetStep._id}
                                    onClick={() => handleStepChange(targetStep._id)}
                                >
                                    <StepItem
                                        step={{
                                            _id: targetStep._id,
                                            name: targetStep.number,
                                            type: "To-do" as StepType
                                        }}
                                    />
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>
                                There are no further steps
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <div className='flex items-center space-x-2'>
                                    <RouteIcon className='h-4 w-4' />
                                    <span>Modify Route</span>
                                </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onSelect={(e) => {
                                        e.preventDefault();
                                    }}>
                                        <div className='flex items-center space-x-2'>
                                            <ListIcon className='h-4 w-4' />
                                            <span>From List View</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div className='flex items-center space-x-2'>
                                            <HammerIcon className='h-4 w-4' />
                                            <span>From Builder View</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            setDeleteDialogOpen(true);
                        }}>
                            <div className='flex items-center space-x-2 text-destructive'>
                                <TrashIcon className='h-4 w-4' />
                                <span>Delete Route</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}