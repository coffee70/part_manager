import { CircleUserIcon } from 'lucide-react';
import { formatDate } from '@/lib/date';

type Props = {
    name: string;
    at?: string;
}

export default function People({ name, at }: Props) {
    return (
        <div className="flex items-center space-x-2 justify-end">
            {at ? (
                <span className="text-sm text-text">{`${formatDate(at)} by ${name}`}</span>
            ) : (
                <span className="text-sm text-text">{name}</span>
            )}
            <CircleUserIcon className="text-text" />
        </div>
    )
}