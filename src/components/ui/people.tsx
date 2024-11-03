import { CircleUserIcon } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

type IconPosition = 'left' | 'right';

type Props = {
    name?: string;
    at?: Date;
    iconPosition: IconPosition;
}

export default function People({ name, at, iconPosition }: Props) {
    return (
        <div className={cn("flex items-center space-x-2 text-sm", iconPosition === 'right' ? 'justify-end' : '')}>
            {iconPosition === "left" && <CircleUserIcon className="shrink-0" strokeWidth={1} />}
            {at ? (
                <span>{`${formatDate(at)} by ${name}`}</span>
            ) : (
                <span>{name}</span>
            )}
            {iconPosition === "right" && <CircleUserIcon className="shrink-0" strokeWidth={1} />}
        </div>
    )
}