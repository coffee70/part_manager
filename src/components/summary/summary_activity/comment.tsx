import { formatCommentDate } from '@/lib/date';
import { PencilIcon, TrashIcon } from 'lucide-react';
import UpdateComment from './update_comment';

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
        <div key={comment._id} className='flex flex-col space-y-3 pt-1 border-t border-foreground'>
            <div className='text-sm text-muted-foreground'>{comment.user.name} commented {formatCommentDate(comment.updatedAt).toLowerCase()}</div>
            <div className='text-sm'>{comment.text}</div>
            <div className='flex space-x-3'>
                <UpdateComment comment={comment}>
                    <button type='button' className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary'>
                        <PencilIcon className='h-3 w-3' />
                        <span>Edit</span>
                    </button>
                </UpdateComment>
                <div className='border-l border-foreground my-1'></div>
                <button type='button' className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary'>
                    <TrashIcon className='h-3 w-3' />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    )
}