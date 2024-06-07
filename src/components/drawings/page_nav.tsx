import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useDrawingViewerContext } from './context';

export default function PageNav() {
    const { numPages, pageNumber, setPageNumber } = useDrawingViewerContext()

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
        <div className='flex items-center space-x-2 p-2 shadow-md'>
        <Button variant='icon' onClick={decrementPage}>
            <ChevronLeftIcon />
        </Button>
        <p>Page {pageNumber} of {numPages}</p>
        <Button variant='icon' onClick={incrementPage}>
            <ChevronRightIcon />
        </Button>
    </div>
    )
}