'use client'
import React from 'react';
import { Dialog, DialogTrigger, DialogTitle, DialogContent } from '@/components/ui/dialog';
import PDFViewer from './pdf_viewer';
import PDFPreview from './pdf_preview';

type Props = {
    file: string;
}

export default function Attachment({ file }: Props) {
    const [open, setOpen] = React.useState<boolean>(false)
    return (
        <>
            <PDFPreview file={file} setOpen={setOpen} />
            <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
                <DialogContent>
                    <DialogTitle>{file}</DialogTitle>
                    <PDFViewer file={file} />
                </DialogContent>
            </Dialog>
        </>
    )
}