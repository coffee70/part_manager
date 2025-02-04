'use client'
import { Document, Page, pdfjs } from 'react-pdf';
import { useDrawingViewerContext } from './context';

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