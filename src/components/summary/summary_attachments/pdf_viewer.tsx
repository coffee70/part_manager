'use client'
import React from 'react';
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

export default function PDFViewer({ file }: Props) {
    const [blob, setBlob] = React.useState<Blob | null>(null);

    React.useEffect(() => {
        async function fetchBlob() {
            const blob = await fetch(`data:${file.type};base64,${file.base64}`).then(res => res.blob());
            setBlob(blob);
        }
        fetchBlob();
    }, [file])

    return (
        <div
            className='border border-border'
            aria-label={`attachment_viewer_${file.name}`}
        >
            <Document file={blob}>
                <Thumbnail pageNumber={1} />
            </Document>
        </div>
    )
}