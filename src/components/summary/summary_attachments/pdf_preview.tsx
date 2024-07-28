'use client'
import React from 'react';
import { Document, Thumbnail, pdfjs } from 'react-pdf';
import { Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

type Props = {
    file: {
        name: string;
        url: string
    };
    setOpen: (open: boolean) => void;
}

export default function PDFPreview({ file, setOpen }: Props) {
    const [hovered, setHovered] = React.useState<boolean>(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setOpen(true)}
        >
            <Document file={file.url} className='border border-foreground'>
                <Thumbnail
                    scale={0.25}
                    pageNumber={1}
                    onItemClick={() => setOpen(true)}
                />
            </Document>
            <div className={cn('flex items-center justify-between bg-foreground', !hovered ? 'invisible' : '')}>
                <div className='text-sm p-2'>{file.name}</div>
                <Button variant='icon' disabled={!hovered} className='p-2'>
                    <Trash2Icon strokeWidth={1} size={20} />
                </Button>
            </div>
        </div>
    )
}