'use client'
import React from 'react';
import { Document, Thumbnail, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

type Props = {
    file: string;
}

export default function PDFViewer({ file }: Props) {

    return (
        <div className='border border-border'>
            <Document file={file}>
                <Thumbnail pageNumber={1} />
            </Document>
        </div>
    )
}