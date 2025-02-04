'use client'
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Document, Thumbnail, pdfjs } from 'react-pdf';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import DownloadAttachment from './download_attachment';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

/**
 * This one works in Playwright Chromium browser and when running npm run build.
 */
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/**
 * This will not work in Playwright Chromium browser due to unpkg.com not sending the
 * correct CORS headers.
 */
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/** 
 * This will give a webpack error when running npm run build!!
 */
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

type Props = {
    file: {
        _id: string;
        name: string;
        base64: string;
        type: string;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function AttachmentViewer({ file, open, setOpen }: Props) {

    const [numPages, setNumPages] = React.useState<number>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);

    const onLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    }

    const [blob, setBlob] = React.useState<Blob | null>(null);

    React.useEffect(() => {
        async function fetchBlob() {
            const blob = await fetch(`data:${file.type};base64,${file.base64}`).then(res => res.blob());
            setBlob(blob);
        }
        fetchBlob();
    }, [file])

    const [show, setShow] = React.useState(true);
    const [hovered, setHovered] = React.useState<boolean>(false);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;

        const handleMouseMove = () => {
            setShow(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (hovered) return;
                setShow(false);
            }, 500);
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }, [hovered]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>{file.name}</DialogTitle>
                <DialogDescription>
                    <VisuallyHidden.Root>
                        Viewer for {file.name}
                    </VisuallyHidden.Root>
                </DialogDescription>
                <div
                    className='relative border border-border'
                    aria-label={`attachment_viewer_${file.name}`}
                >
                    <div
                        className={cn(
                            'z-10 absolute inset-x-20 bottom-5 flex items-center justify-between bg-foreground border border-muted-foreground shadow-lg rounded-full p-2 transition-all duration-300 ease-in-out',
                            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                        )}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <div className='w-8 h-8' />
                        <div className='flex items-center space-x-2'>
                            <button
                                className='flex items-center justify-center bg-foreground disabled:hover:bg-foreground disabled:text-accent-foreground hover:bg-accent-foreground w-8 h-8 rounded-full'
                                onClick={() => setPageNumber(pageNumber - 1)}
                                disabled={pageNumber === 1}
                            >
                                <ChevronLeftIcon />
                            </button>
                            <span>{pageNumber} / {numPages}</span>
                            <button
                                className='flex items-center justify-center bg-foreground disabled:hover:bg-foreground disabled:text-accent-foreground hover:bg-accent-foreground w-8 h-8 rounded-full'
                                onClick={() => setPageNumber(pageNumber + 1)}
                                disabled={pageNumber === numPages}
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                        <div>
                            <DownloadAttachment file={file} />
                        </div>
                    </div>
                    <Document file={blob} onLoadSuccess={onLoadSuccess}>
                        <Thumbnail pageNumber={pageNumber} />
                    </Document>
                </div>
            </DialogContent>
        </Dialog>
    )
}

