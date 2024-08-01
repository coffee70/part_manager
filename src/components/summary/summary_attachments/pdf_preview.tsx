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

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setOpen(true)}
            style={{ width }}
        >
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
            <div className={cn('flex items-center justify-between bg-foreground', !hovered ? 'invisible' : '')}>
                <div className='text-sm p-2 overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</div>
                <Button variant='icon' disabled={!hovered} className='p-2'>
                    <Trash2Icon strokeWidth={1} size={20} />
                </Button>
            </div>
        </div>
    )
}