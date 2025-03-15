'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu'
import MoreButton from './more_button'
import { useMoreContext } from './more_context';
import { HammerIcon, LinkIcon, MessageCircleIcon, PaperclipIcon, RouteIcon, CopyIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contextKeys, routeKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { isAttachable } from '@/server/contexts/is_attachable';
import { isLinkable } from '@/server/contexts/is_linkable';
import { isCommentable } from '@/server/contexts/is_commentable';
import { getRoute } from '@/server/routes/get_route';
import Builder from '@/components/route_builder/list_view/builder';

export default function More() {
    const { context, id, instanceId } = useInstanceURL();
    
    // Create a ref for the Builder's hidden trigger button
    const builderTriggerRef = React.useRef<HTMLButtonElement>(null);

    const { data: attachable } = useQuery({
        queryKey: contextKeys.attachable(context, id),
        queryFn: () => isAttachable({ context, id }),
    })

    const { data: linkable } = useQuery({
        queryKey: contextKeys.linkable(context, id),
        queryFn: () => isLinkable({ context, id }),
    })

    const { data: commentable } = useQuery({
        queryKey: contextKeys.commentable(context, id),
        queryFn: () => isCommentable({ context, id }),
    })

    const { data: route } = useQuery({
        queryKey: routeKeys.id(id, instanceId),
        queryFn: () => getRoute({ modelId: id, instanceId }),
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

    const handleAddRoute = () => {
        console.log('add route');
    }

    // Function to open the Builder dialog by clicking its hidden trigger
    const handleOpenBuilder = () => {
        builderTriggerRef.current?.click();
    }

    if (!attachable && !linkable && !commentable && context === "routers") return null;

    return (
        <>
            <Builder>
                <button 
                    ref={builderTriggerRef} 
                    style={{ display: 'none' }} 
                    aria-hidden="true"
                >
                    Open Builder
                </button>
            </Builder>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <MoreButton />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-48'>
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
                        {context === "models" && !route && (
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger onClick={handleAddRoute}>
                                    <div className='flex items-center space-x-2'>
                                        <RouteIcon className='h-4 w-4' />
                                        <span>Add Route</span>
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault();
                                            handleOpenBuilder();
                                        }}>
                                            <div className='flex items-center space-x-2'>
                                                <HammerIcon className='h-4 w-4' />
                                                <span>From Builder</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <div className='flex items-center space-x-2'>
                                                <CopyIcon className='h-4 w-4' />
                                                <span>From Clone</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}