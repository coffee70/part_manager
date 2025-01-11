'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import { Document, Thumbnail, pdfjs } from 'react-pdf';
import DeleteAttachment from './delete_attachment';
import AttachmentViewer from './attachment_viewer';

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
    const [open, setOpen] = React.useState<boolean>(false)

    const [hovered, setHovered] = React.useState<boolean>(false)
    const [width, setWidth] = React.useState<number>(0)
    const [blob, setBlob] = React.useState<Blob | null>(null);

    const onLoadSuccess = async (pdf: any) => {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: SCALE });
        setWidth(viewport.width + WIDTH_TOLERANCE);
    }

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
                    onClick={() => setOpen(true)}
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
                            onItemClick={() => setOpen(true)}
                        />
                    </Document>
                </div>
                <div className={cn('flex items-center justify-between bg-foreground', !hovered ? 'invisible' : '')}>
                    <div className='text-sm p-2 overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</div>
                    <DeleteAttachment file={file} hovered={hovered} />
                </div>
            </div>
            <AttachmentViewer file={file} open={open} setOpen={setOpen} />
        </>
    )
}