import { formatDate } from '@/lib/date';

type Props = {
    comment: {
        _id: string;
        user: {
            name: string;
        };
        updatedAt: string;
        text: string;
    }
}

export default function Comment({ comment }: Props) {
    return (
        <div key={comment._id} className='flex flex-col space-y-2 border-t border-foreground'>
        <div className='text-sm text-muted-foreground'>{comment.user.name} commented {formatDate(comment.updatedAt).toLowerCase()}</div>
        <div className='text-sm'>{comment.text}</div>
    </div>
    )
}