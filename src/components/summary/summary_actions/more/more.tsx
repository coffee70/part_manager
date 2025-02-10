'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import MoreButton from './more_button'
import { useMoreContext } from './more_context';
import { LinkIcon, MessageCircleIcon, PaperclipIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { isAttachable } from '@/server/models/is_attachable';
import { isLinkable } from '@/server/models/is_linkable';
import { isCommentable } from '@/server/models/is_commentable';

export default function More() {

    const { modelId } = useInstanceURL();

    const { data: attachable } = useQuery({
        queryKey: modelKeys.attachable(modelId),
        queryFn: () => isAttachable({ modelId }),
    })

    const { data: linkable } = useQuery({
        queryKey: modelKeys.linkable(modelId),
        queryFn: () => isLinkable({ modelId }),
    })

    const { data: commentable } = useQuery({
        queryKey: modelKeys.commentable(modelId),
        queryFn: () => isCommentable({ modelId }),
    })

    const {
        attachmentsInputRef,
        setLinkOpen,
        commentsTextAreaRef
    } = useMoreContext();

    const handleAddAttachment = () => {
        attachmentsInputRef.current?.click();
    }

    const handleAddLink = () => {
        setLinkOpen(true);
    }

    const handleAddComment = () => {
        setTimeout(() => {
            commentsTextAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
            commentsTextAreaRef.current?.focus();
        }, 0);
    }

    if (!attachable && !linkable && !commentable) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {attachable && <DropdownMenuItem onClick={handleAddAttachment}>
                        <div className='flex items-center space-x-2'>
                            <PaperclipIcon className='h-4 w-4' />
                            <span>Add Attachment</span>
                        </div>
                    </DropdownMenuItem>}
                    {linkable && <DropdownMenuItem onClick={handleAddLink}>
                        <div className='flex items-center space-x-2'>
                            <LinkIcon className='h-4 w-4' />
                            <span>Add Link</span>
                        </div>
                    </DropdownMenuItem>}
                    {commentable && <DropdownMenuItem onClick={handleAddComment}>
                        <div className='flex items-center space-x-2'>
                            <MessageCircleIcon className='h-4 w-4' />
                            <span>Add Comment</span>
                        </div>
                    </DropdownMenuItem>}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}