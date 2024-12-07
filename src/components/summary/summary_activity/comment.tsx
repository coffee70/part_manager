import { formatCommentDate } from '@/lib/date';
import CommentActions from './comment_actions';

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

export default function Comment({ comment }: Props) {
    return (
        <div key={comment._id} className='flex flex-col space-y-3 pt-1 border-t border-foreground'>
            <div className='text-sm text-muted-foreground'>
                {comment.user.name} commented {formatCommentDate(comment.updatedAt).toLowerCase()}
            </div>
            <div className='text-sm'>{comment.text}</div>
            {(comment.editable || comment.deletable) && (
                <CommentActions comment={comment} />
            )}
        </div>
    );
}

