'use client'
import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useConfirm } from "@/hooks/confirm.hook"
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { commentKeys } from "@/lib/query_keys";
import { deleteComment } from "@/server/comments/delete_comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

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

    const { mutate } = useMutation({
        mutationFn: async () => {
            setOpen(true);
            const ans = await confirm();
            if (ans) await deleteComment({ _id: _id, collection, commentId: id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all(collection, _id) });
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Field</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this field?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}