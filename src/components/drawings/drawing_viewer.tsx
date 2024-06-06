'use client'
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import DimensionTracer from './dimension_tracer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

type Props = {
    file: string;
}

export default function DrawingViewer({ file }: Props) {
    const [numPages, setNumPages] = React.useState<number>(0);
    const [pageNumber, setPageNumber] = React.useState<number>(1);

    const onLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }

    const incrementPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(prev => prev + 1)
        }
    }

    const decrementPage = () => {
        if (pageNumber > 1) {
            setPageNumber(prev => prev - 1)
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='relative'>
                <Document file={file} onLoadSuccess={onLoadSuccess}>
                    <Page
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        pageNumber={pageNumber}
                    />
                </Document>
                <DimensionTracer />
            </div>
            <div className='flex items-center space-x-2 p-2 shadow-md'>
                <Button variant='icon' onClick={decrementPage}>
                    <ChevronLeftIcon />
                </Button>
                <p>Page {pageNumber} of {numPages}</p>
                <Button variant='icon' onClick={incrementPage}>
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>
    )
}



