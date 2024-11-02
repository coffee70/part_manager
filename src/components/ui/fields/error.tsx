import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { TriangleAlertIcon } from 'lucide-react';

export default function Error({ message }: { message?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className='grow flex items-center p-1 bg-red-500'>
                    <TriangleAlertIcon className="text-white" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <div className='rounded-sm bg-red-500 p-2'>
                    <p className='text-xs text-white font-bold'>{message}</p>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}