import { PencilIcon, TrashIcon } from 'lucide-react';
import UpdateComment from './update_comment';
import DeleteComment from './delete_comment';

type Props = {
    comment: {
        _id: string;
        user: {
            name: string;
        };
        updatedAt: string;
        text: string;
        editable: boolean;
        deletable: boolean;
    }
}

export default function CommentActions({ comment }: Props) {
    return (
        <div className='flex space-x-3'>
            {comment.editable && (
                <UpdateComment comment={comment}>
                    <button
                        type='button'
                        className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary'
                    >
                        <PencilIcon className='h-3 w-3' />
                        <span>Edit</span>
                    </button>
                </UpdateComment>
            )}
            {comment.editable && comment.deletable && (
                <div className='border-l border-foreground my-1'></div>
            )}
            {comment.deletable && (
                <DeleteComment id={comment._id}>
                    <button
                        type='button'
                        className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary'
                    >
                        <TrashIcon className='h-3 w-3' />
                        <span>Delete</span>
                    </button>
                </DeleteComment>
            )}
        </div>
    );
}