'use client'
import React from 'react';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { instanceKeys, modelKeys } from "@/lib/query_keys";
import { deleteModel } from "@/server/instances/delete_instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { More } from "@/components/ui/more";
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getModel } from '@/server/models/get_model';

type Props = {
    id: string;
}

export default function DeleteInstance({ id: instanceId }: Props) {
    const [open, setOpen] = React.useState(false);

    const { modelId, instanceId: urlInstanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => deleteModel({ modelId, instanceId, urlInstanceId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) })
        }
    })

    const { data: model } = useQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Instance: {model?.name}</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this instance?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button onClick={() => mutate()}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <More />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setOpen(true)}>Delete</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}