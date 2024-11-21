'use client'
import React from 'react';
import { Document, Thumbnail, pdfjs } from 'react-pdf';
import { Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { useConfirm } from '@/hooks/confirm.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAttachment } from '@/server/attachments/delete_attachment';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { collectionKeys } from '@/lib/query_keys';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

type Props = {
    file: {
        _id: string;
        name: string;
        url: string
    };
    setOpen: (open: boolean) => void;
}

const SCALE = 0.25;
const WIDTH_TOLERANCE = 2;

export default function PDFPreview({ file, setOpen }: Props) {
    const [hovered, setHovered] = React.useState<boolean>(false)
    const [width, setWidth] = React.useState<number>(0)

    const onLoadSuccess = async (pdf: any) => {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: SCALE });
        setWidth(viewport.width + WIDTH_TOLERANCE);
    }

    const { id, collection } = useURLMetadata();

    const { confirm, handleConfirm, handleCancel } = useConfirm();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const ans = await confirm();
            if (ans) await deleteAttachment({ id: file._id, modelId: id, model: collection });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) });
            // updates the table view to show the updated at change
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
        }
    })

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width }}
        >
            <div onClick={() => setOpen(true)}>
                <Document
                    file={file.url}
                    className='border border-foreground'
                    onLoadSuccess={onLoadSuccess}
                >
                    <Thumbnail
                        scale={0.25}
                        pageNumber={1}
                        onItemClick={() => setOpen(true)}
                    />
                </Document>
            </div>
            <div className={cn('flex items-center justify-between bg-foreground', !hovered ? 'invisible' : '')}>
                <div className='text-sm p-2 overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='icon'
                            disabled={!hovered}
                            className='p-2'
                            onClick={() => mutate()}
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
                            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    )
}