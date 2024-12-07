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
import { useConfirm } from "@/hooks/confirm.hook"
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { collectionKeys, commentKeys } from "@/lib/query_keys";
import { deleteComment } from "@/server/comments/delete_comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
    id: string;
    children: React.ReactNode;
}

export default function DeleteComment({ id, children }: Props) {
    const [open, setOpen] = React.useState(false);

    const { collection, id: _id } = useURLMetadata();

    const queryClient = useQueryClient();

    const { confirm, handleConfirm, handleCancel } = useConfirm();

    const onOpenChange = (open: boolean) => {
        setOpen(open);
        if (open) mutate();
    }

    const { mutate, error, isError } = useMutation({
        mutationFn: async () => {
            setOpen(true);
            const ans = await confirm();
            if (ans) await deleteComment({ _id: _id, collection, commentId: id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all(collection, _id) });
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
            setOpen(false);
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {children}
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
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <Button onClick={handleConfirm}>Delete</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}