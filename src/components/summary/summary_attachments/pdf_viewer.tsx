'use client'
import React from 'react';
import { Document, Thumbnail, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

type Props = {
    url: string;
}

export default function PDFViewer({ url }: Props) {

    return (
        <div className='border border-border'>
            <Document file={url}>
                <Thumbnail pageNumber={1} />
            </Document>
        </div>
    )
}