'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contextKeys, instanceKeys, routeKeys } from '@/lib/query_keys';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronDown, Loader as LoaderIcon } from 'lucide-react';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import Loader from '@/components/ui/loader';
import { getInstances } from '@/server/instances/get_instances';
import { hasRoute } from '@/server/routes/has_route';
import { upsertRouteFromCloneView } from '@/server/routes/upsert_route_from_clone_view';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getContexts } from '@/server/contexts/get_contexts';

type Props = {
    children?: React.ReactNode;
};

export default function CloneView({ children }: Props) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedModelId, setSelectedModelId] = React.useState<string>('');
    const [selectedInstanceId, setSelectedInstanceId] = React.useState<string>('');

    // Get modelId and instanceId from URL
    const { id: modelId, instanceId } = useInstanceURL();

    // Refs for measuring trigger widths
    const modelTriggerRef = React.useRef<HTMLButtonElement>(null);
    const instanceTriggerRef = React.useRef<HTMLButtonElement>(null);
    const [modelTriggerWidth, setModelTriggerWidth] = React.useState(0);
    const [instanceTriggerWidth, setInstanceTriggerWidth] = React.useState(0);

    const queryClient = useQueryClient();

    // Get all models
    const { data: models = [] } = useQuery({
        queryKey: contextKeys.all("models"),
        queryFn: () => getContexts({ context: "models" }),
        enabled: open
    });

    // Get instances for the selected model with routes
    const { data: instances = [], isLoading: isLoadingInstances } = useQuery({
        queryKey: ['instances', 'models', selectedModelId, 'withRoutes'],
        queryFn: async () => {
            const allInstances = await getInstances({ id: selectedModelId });

            // Filter instances to only those with routes
            const filteredInstances = [];
            let i = 0;

            for (const instance of allInstances) {
                i++;
                // Update progress in console for debugging
                if (i % 10 === 0) {
                    console.log(`Checking routes: ${i}/${allInstances.length}`);
                }

                const hasRouteResult = await hasRoute({
                    modelId: selectedModelId,
                    instanceId: instance._id
                });

                if (hasRouteResult) {
                    filteredInstances.push(instance);
                }
            }

            if (filteredInstances.length === 0) {
                setError(`No instances with routes found for the selected model.`);
            } else {
                setError(null);
            }

            return filteredInstances;
        },
        enabled: !!selectedModelId && open,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes to avoid repeated filtering
        refetchOnWindowFocus: false,
    });

    // Setup mutation for cloning the route
    const { mutate: cloneRoute, isPending } = useMutation({
        mutationFn: upsertRouteFromCloneView,
        onSuccess: (data) => {
            if (data.success) {
                // On success, just close the dialog and invalidate queries
                queryClient.invalidateQueries({ queryKey: routeKeys.id(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.isStarted(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.currentStep(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.targetSteps(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: routeKeys.hasRoute(modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: instanceKeys.id('models', modelId, instanceId) });
                queryClient.invalidateQueries({ queryKey: instanceKeys.all('models', modelId) });

                // Close dialog
                setOpen(false);

                // Clear any errors
                setError(null);
            } else {
                // Display error message
                setError(data.error || 'Failed to clone route');
            }
        },
        onError: (error) => {
            setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });

    const handleModelSelect = (modelId: string) => {
        setSelectedModelId(modelId);
        setSelectedInstanceId('');
        setError(null);
    };

    const handleInstanceSelect = (instanceId: string) => {
        setSelectedInstanceId(instanceId);
        setError(null);
    };

    const handleSubmit = () => {
        if (!selectedModelId || !selectedInstanceId) {
            setError('Please select a model and instance');
            return;
        }

        // Clone the route
        cloneRoute({
            targetModelId: modelId,
            targetInstanceId: instanceId,
            sourceModelId: selectedModelId,
            sourceInstanceId: selectedInstanceId
        });
    };

    // Handle dropdown open to measure width
    const handleModelDropdownOpen = (open: boolean) => {
        if (open && modelTriggerRef.current) {
            setModelTriggerWidth(modelTriggerRef.current.offsetWidth);
        }
    };

    const handleInstanceDropdownOpen = (open: boolean) => {
        if (open && instanceTriggerRef.current) {
            setInstanceTriggerWidth(instanceTriggerRef.current.offsetWidth);
        }
    };

    // Reset state when dialog is closed
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setError(null);
            setSelectedModelId('');
            setSelectedInstanceId('');
        }
    };

    // Get selected model name for display
    const selectedModelName = selectedModelId
        ? models.find(model => model._id === selectedModelId)?.name || 'Select a model'
        : 'Select a model';

    // Get selected instance number for display
    const selectedInstanceNumber = selectedInstanceId
        ? instances.find(instance => instance._id === selectedInstanceId)?.number || 'Select an instance'
        : isLoadingInstances ? 'Loading instances with routes...' : 'Select an instance';

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Clone Route</DialogTitle>
                    <DialogDescription>
                        <VisuallyHidden.Root>
                            Clone a route from another model instance
                        </VisuallyHidden.Root>
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant='destructive'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Model</label>
                        <DropdownMenu onOpenChange={handleModelDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    ref={modelTriggerRef}
                                    variant="outline"
                                    className="w-full justify-between border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-normal transition-colors duration-200"
                                >
                                    {selectedModelName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                style={{ width: `${modelTriggerWidth}px` }}
                                className="border-stone-200 bg-white shadow-sm"
                                align="start"
                            >
                                {models.map(model => (
                                    <DropdownMenuItem
                                        key={model._id}
                                        onClick={() => handleModelSelect(model._id)}
                                        className="text-stone-700 hover:bg-stone-50"
                                    >
                                        {model.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Instance with Route</label>
                        <DropdownMenu onOpenChange={handleInstanceDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    ref={instanceTriggerRef}
                                    variant="outline"
                                    className="w-full justify-between border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-normal transition-colors duration-200"
                                    disabled={!selectedModelId || isLoadingInstances}
                                >
                                    {isLoadingInstances && (
                                        <span className="inline-flex items-center">
                                            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                            {selectedInstanceNumber}
                                        </span>
                                    )}
                                    {!isLoadingInstances && selectedInstanceNumber}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                style={{ width: `${instanceTriggerWidth}px` }}
                                className="border-stone-200 bg-white shadow-sm"
                                align="start"
                            >
                                {instances.length === 0 && !isLoadingInstances ? (
                                    <DropdownMenuItem disabled>
                                        No instances with routes available
                                    </DropdownMenuItem>
                                ) : (
                                    instances.map(instance => (
                                        <DropdownMenuItem
                                            key={instance._id}
                                            onClick={() => handleInstanceSelect(instance._id)}
                                            className="text-stone-700 hover:bg-stone-50"
                                        >
                                            {instance.number}
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!selectedModelId || !selectedInstanceId || isPending}
                    >
                        {isPending ? <Loader /> : 'Clone Route'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 