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
} from '@/components/ui/alert-dialog';
import { useAdminURL } from '@/hooks/url_metadata.hook';
import { sectionKeys } from '@/lib/query_keys';
import { useSectionContext } from '../section.context';
import Loader from '@/components/ui/loader';
import { TooltipWrapper } from '@/components/ui/tooltip_wrapper';

export default function DeleteSection() {
    const { section } = useSectionContext();
    const { _id } = section;

    const { context, id } = useAdminURL();
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteSection({ _id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
        }
    })

    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button variant='icon' size='icon' className='bg-secondary interactive-subtle'>
                            <div className="flex items-center">
                                <Trash2Icon size={16} />
                            </div>
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <TooltipWrapper>
                        <span>Delete Section</span>
                    </TooltipWrapper>
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Section</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this section?</AlertDialogDescription>
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
    )
}