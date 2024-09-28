'use client'
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSection } from '@/server/sections/delete_section';
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '../../ui/alert-dialog';
import { useConfirm } from '@/hooks/confirm.hook';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { sectionKeys } from '@/lib/query_keys';

type Props = {
    _id: string;
}

export default function DeleteSection({ _id }: Props) {
    const { collection } = useURLMetadata();
    const queryClient = useQueryClient()

    const { confirm, handleConfirm, handleCancel } = useConfirm()

    const { mutate } = useMutation({
        mutationFn: async () => {
            const ans = await confirm()
            if (ans) await deleteSection({ _id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(collection) })
        }
    })

    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='icon'
                            size='icon'
                            onClick={() => mutate()}
                        >
                            <div className="flex items-center">
                                <Trash2Icon size={16} />
                            </div>
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                        <span>Delete Section</span>
                    </div>
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Section</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this section?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}