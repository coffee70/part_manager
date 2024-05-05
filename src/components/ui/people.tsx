import { CircleUserIcon } from 'lucide-react';
import { formatDate } from '@/lib/date';

type Props = {
    name: string;
    at?: string;
}

export default function People({ name, at }: Props) {
    return (
        <div className="flex items-center space-x-2 justify-end text-sm">
            <CircleUserIcon className="shrink-0" strokeWidth={1} />
            {at ? (
                <span>{`${formatDate(at)} by ${name}`}</span>
            ) : (
                <span>{name}</span>
            )}
        </div>
    )
}