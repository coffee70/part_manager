import { CircleCheckIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props<T extends string> = {
    value?: T;
    onChange: (value: T) => void;
    labels: string[]
    stacked?: boolean;
}

export default function ButtonGroup<T extends string>({ value, onChange, labels, stacked }: Props<T>) {
    return (
        <div className="flex justify-between space-x-2 min-h-12">
            {labels.map(label => (
                <div
                    key={label}
                    className={cn("flex-1 flex items-center justify-between px-4 border border-muted-foreground", stacked ? 'flex-col py-2 space-y-2' : '')}
                    onClick={() => onChange(label)}
                >
                    <span className='text-sm'>{label}</span>
                    {value === label && <CircleCheckIcon strokeWidth={1} size={stacked ? 24 : 30} />}
                    {value !== label && <CircleIcon strokeWidth={1} size={stacked ? 24 : 30} />}
                </div>
            ))}
        </div>
    )
}