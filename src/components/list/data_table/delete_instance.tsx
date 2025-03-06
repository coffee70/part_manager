'use client'
import React from 'react';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { contextKeys, instanceKeys } from "@/lib/query_keys";
import { deleteInstance } from "@/server/instances/delete_instance";
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
import Loader from '@/components/ui/loader';
import { getContext } from '@/server/contexts/get_context';

type Props = {
    id: string;
}

export default function DeleteInstance({ id: instanceId }: Props) {
    const [open, setOpen] = React.useState(false);

    const { context, id, instanceId: urlInstanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteInstance({ id, instanceId, urlInstanceId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) })
        }
    })

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({ context, id }),
    })

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Instance: {contextImpl?.name}</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this instance?</AlertDialogDescription>
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