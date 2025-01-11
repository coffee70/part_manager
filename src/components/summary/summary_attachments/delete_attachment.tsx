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

type Props = {
    file: {
        _id: string;
        name: string;
    };
    hovered: boolean;
}

export default function DeleteAttachment({ file, hovered }: Props) {
    const [openDelete, setOpenDelete] = React.useState<boolean>(false)

    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: () => deleteAttachment({ modelId, instanceId, attachmentId: file._id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: attachmentKeys.all(modelId, instanceId) });
            // updates the table view to show the updated at change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) });
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
                    <Button onClick={() => mutate()}>Delete</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}