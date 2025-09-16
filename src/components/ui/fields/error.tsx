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
                <div className='grow flex items-center p-1 bg-destructive'>
                    <TriangleAlertIcon className="text-destructive-text" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <div className='rounded-sm bg-destructive p-2'>
                    <p className='text-xs text-destructive-text font-bold'>{message}</p>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}