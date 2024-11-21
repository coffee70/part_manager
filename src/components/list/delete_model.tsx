'use client'
import React from 'react';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { collectionKeys } from "@/lib/query_keys";
import { deleteModel } from "@/server/models/delete_model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { More } from "@/components/ui/more";
import { useConfirm } from "@/hooks/confirm.hook";
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog';
import { collectionToName } from '@/lib/conversions';
import { pluralToSingular } from '@/lib/language';

type Props = {
    id: string;
}

export default function DeleteModel({ id }: Props) {
    const [open, setOpen] = React.useState(false);
    const { id: urlId, collection } = useURLMetadata();

    const queryClient = useQueryClient();

    const { confirm, handleConfirm, handleCancel } = useConfirm();

    const { mutate } = useMutation({
        mutationFn: async () => {
            setOpen(true)
            const ans = await confirm()
            if (ans) await deleteModel({ id, urlId, model: collection })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) })
        }
    })

    const collectionName = collectionToName[collection];
    const singularCollectionName = pluralToSingular(collectionName);
    const singularCollectionNameLower = singularCollectionName.toLowerCase()

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {singularCollectionName}</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this {singularCollectionNameLower}?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <More />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => mutate()}>Delete</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}