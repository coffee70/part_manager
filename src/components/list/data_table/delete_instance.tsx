'use client'
import React from 'react';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { contextKeys, instanceKeys } from "@/lib/query_keys";
import { deleteInstance } from "@/server/instances/delete_instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { More } from "@/components/ui/more";
import { useRouter, useSearchParams } from "next/navigation";
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
import { TrashIcon } from 'lucide-react';
import { clientToServerSearchParams } from '@/lib/search_params';

type Props = {
    id: string;
}

export default function DeleteInstance({ id: instanceId }: Props) {
    const [open, setOpen] = React.useState(false);

    const { context, id, instanceId: urlInstanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const readOnlySearchParams = useSearchParams();

    const { push } = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteInstance,
        onSuccess: ({ success, data }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) })
                setOpen(false);
                if (data?.url) {
                    push(data.url);
                }
            }
        }
    })

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({ context, id }),
    })

    const handleClick = () => {
        const convertedSearchParams = clientToServerSearchParams(readOnlySearchParams);
        mutate({
            context,
            id,
            instanceId,
            urlInstanceId,
            searchParams: convertedSearchParams,
        })
    }

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
                            onClick={handleClick}
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
                        <DropdownMenuItem
                            className="flex items-center gap-2 text-destructive hover:bg-destructive-focus focus:bg-destructive-focus"
                            onClick={() => setOpen(true)}
                        >
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}