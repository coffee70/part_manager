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
                <UpdateComment comment={comment} />
            )}
            {comment.editable && comment.deletable && (
                <div className='border-l border-foreground my-1'></div>
            )}
            {comment.deletable && (
                <DeleteComment id={comment._id} />
            )}
        </div>
    );
}