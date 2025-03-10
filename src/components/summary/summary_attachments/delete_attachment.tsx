'use client'
import React from 'react';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAttachment } from '@/server/attachments/delete_attachment';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { attachmentKeys, instanceKeys } from '@/lib/query_keys';
import Loader from '@/components/ui/loader';

type Props = {
    file: {
        _id: string;
        name: string;
    };
    hovered: boolean;
}

export default function DeleteAttachment({ file, hovered }: Props) {
    const [openDelete, setOpenDelete] = React.useState<boolean>(false)

    const { context, id, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteAttachment({ 
            id, 
            instanceId, 
            attachmentId: file._id 
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: attachmentKeys.all(context, id, instanceId) });
            // updates the table view to show the updated at change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            setOpenDelete(false);
        }
    })
    
    return (
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogTrigger asChild>
                <Button
                    variant='icon'
                    disabled={!hovered}
                    className='p-2'
                    aria-label={`delete_attachment_${file.name}`}
                >
                    <Trash2Icon strokeWidth={1} size={20} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this attachment?</AlertDialogDescription>
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