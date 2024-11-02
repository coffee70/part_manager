import { LoaderCircleIcon } from 'lucide-react';

export default function Loading() {
    return (
        <div className='grow flex items-center p-1 bg-foreground'>
            <LoaderCircleIcon className="animate-spin" />
        </div>
    )
}