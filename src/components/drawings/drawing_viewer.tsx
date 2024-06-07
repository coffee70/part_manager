import DimensionTracer from './dimension_tracer';
import Menu from './menu';
import PDFViewer from './pdf_viewer';
import PageNav from './page_nav';
import { DrawingViewerProvider } from './context';

type Props = {
    file: string;
}

export default function DrawingViewer({ file }: Props) {

    return (
        <DrawingViewerProvider>
            <div className='flex flex-col items-center w-fit'>
                <Menu />
                <div className='relative'>
                    <PDFViewer file={file} />
                    <DimensionTracer />
                </div>
                <PageNav />
            </div>
        </DrawingViewerProvider>
    )
}



