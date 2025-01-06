'use client'
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Document, Thumbnail, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
    file: {
        _id: string;
        name: string;
        base64: string;
        type: string;
    };
}

const SCALE = 0.25;
const WIDTH_TOLERANCE = 2;

export default function Attachment({ file }: Props) {
    const [openPreview, setOpenPreview] = React.useState<boolean>(false)
    const [openDelete, setOpenDelete] = React.useState<boolean>(false)

    const [hovered, setHovered] = React.useState<boolean>(false)
    const [width, setWidth] = React.useState<number>(0)
    const [blob, setBlob] = React.useState<Blob | null>(null);

    const onLoadSuccess = async (pdf: any) => {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: SCALE });
        setWidth(viewport.width + WIDTH_TOLERANCE);
    }

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

    React.useEffect(() => {
        async function fetchBlob() {
            const blob = await fetch(`data:${file.type};base64,${file.base64}`).then(res => res.blob());
            setBlob(blob);
        }
        fetchBlob();
    }, [file])

    React.useEffect(() => {
        async function fetchBlob() {
            const blob = await fetch(`data:${file.type};base64,${file.base64}`).then(res => res.blob());
            setBlob(blob);
        }
        fetchBlob();
    }, [file])
    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{ width }}
            >
                <div
                    onClick={() => setOpenPreview(true)}
                    aria-label={`attachment_preview_${file.name}`}
                >
                    <Document
                        file={blob}
                        className='border border-foreground'
                        onLoadSuccess={onLoadSuccess}
                    >
                        <Thumbnail
                            scale={0.25}
                            pageNumber={1}
                            onItemClick={() => setOpenPreview(true)}
                        />
                    </Document>
                </div>
                <div className={cn('flex items-center justify-between bg-foreground', !hovered ? 'invisible' : '')}>
                    <div className='text-sm p-2 overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</div>
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
                </div>
            </div>
            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                <DialogContent>
                    <DialogTitle>{file.name}</DialogTitle>
                    <div
                        className='border border-border'
                        aria-label={`attachment_viewer_${file.name}`}
                    >
                        <Document file={blob}>
                            <Thumbnail pageNumber={1} />
                        </Document>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}