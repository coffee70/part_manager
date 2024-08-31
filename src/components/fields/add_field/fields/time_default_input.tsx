import { TimeInput as BaseTimeInput, useTimeInput } from '@/components/ui/time_input';
import { cn } from '@/lib/utils';
import { CircleAlertIcon } from 'lucide-react';

type Props = {
    setTime: (time: string) => void;
}

export default function TimeInput({ setTime }: Props) {
    const {
        invalidTime,
        ...inputProps
    } = useTimeInput({ setTime })

    return (
        <label>
            <span>Default Time</span>
            <div className={cn('flex items-center justify-between border p-1', invalidTime ? 'border-red-600 bg-red-100' : 'border-muted-foreground')}>
                <BaseTimeInput {...inputProps} invalidTime={invalidTime}/>
                {invalidTime && <CircleAlertIcon size={28} className='text-red-600 pr-1' />}
            </div>
            {invalidTime && <span className='text-sm text-red-600'>Please enter a valid time.</span>}
        </label>
    )
}