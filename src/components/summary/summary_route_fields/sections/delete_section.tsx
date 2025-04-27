'use client'
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRouteFieldsSection } from '@/server/routers/delete_route_fields_section';
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { routerKeys } from '@/lib/query_keys';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';

type Props = {
    sectionId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteRouteFieldsSection({ sectionId, open, onOpenChange }: Props) {
    const { modelId, instanceId } = useInstanceURL();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteRouteFieldsSection({ 
            modelId, 
            instanceId, 
            sectionId 
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: routerKeys.routeFields(modelId, instanceId) 
            });
            onOpenChange(false);
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Route Fields Section</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this section? All fields in this section will also be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                    >
                        {isPending ? <Loader /> : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 