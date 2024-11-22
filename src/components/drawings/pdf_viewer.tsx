'use client'
import { Document, Page, pdfjs } from 'react-pdf';
import { useDrawingViewerContext } from './context';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
    file: string;
}

export default function PDFViewer({ file }: Props) {

    const { setNumPages, pageNumber } = useDrawingViewerContext()

    const onLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }

    return (
        <div className='border border-border'>
            <Document file={file} onLoadSuccess={onLoadSuccess}>
                <Page
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    pageNumber={pageNumber}
                />
            </Document>
        </div>
    )
}