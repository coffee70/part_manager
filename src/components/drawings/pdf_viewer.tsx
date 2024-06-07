'use client'
import { Document, Page, pdfjs } from 'react-pdf';
import { useDrawingViewerContext } from './context';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

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