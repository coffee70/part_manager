'use client'
import React from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { commentKeys, instanceKeys } from "@/lib/query_keys";
import { deleteComment } from "@/server/comments/delete_comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrashIcon } from "lucide-react";
import Loader from '@/components/ui/loader';

type Props = {
    id: string;
}

export default function DeleteComment({ id: commentId }: Props) {
    const [open, setOpen] = React.useState(false);
    const { context, id, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate, error, isError, isPending } = useMutation({
        mutationFn: () => deleteComment({ id, instanceId, commentId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all(context, id, instanceId) });
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            setOpen(false);
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    type='button'
                    className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary'
                >
                    <TrashIcon className='h-3 w-3' />
                    <span>Delete</span>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this comment?</AlertDialogDescription>
                </AlertDialogHeader>
                {isError && <Alert variant='destructive'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                    >
                        {isPending ? <Loader /> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}