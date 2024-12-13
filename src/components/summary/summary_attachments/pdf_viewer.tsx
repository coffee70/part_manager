'use client'
import React from 'react';
import { Document, Thumbnail, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
    name: string;
    url: string;
}

export default function PDFViewer({ name, url }: Props) {

    return (
        <div
            className='border border-border'
            aria-label={`attachment_viewer_${name}`}
        >
            <Document file={url}>
                <Thumbnail pageNumber={1} />
            </Document>
        </div>
    )
}