'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu'
import MoreButton from './more_button'
import { useMoreContext } from './more_context';
import { LinkIcon, MessageCircleIcon, PaperclipIcon, RouteIcon, CopyIcon, ListIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contextKeys, routeKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { isAttachable } from '@/server/contexts/is_attachable';
import { isLinkable } from '@/server/contexts/is_linkable';
import { isCommentable } from '@/server/contexts/is_commentable';
import Builder from '@/components/route_builder/list_view/builder';
import { hasRoute } from '@/server/routes/has_route';
import CloneView from '@/components/route_builder/clone_view/clone_view';

export default function More() {
    const { context, id, instanceId } = useInstanceURL();

    // Create refs for the hidden trigger buttons
    const routeListViewTriggerRef = React.useRef<HTMLButtonElement>(null);
    const cloneViewTriggerRef = React.useRef<HTMLButtonElement>(null);

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

    const { data: hasRouteResult } = useQuery({
        queryKey: routeKeys.hasRoute(id, instanceId),
        queryFn: () => hasRoute({ modelId: id, instanceId }),
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

    // Function to open dialogs by clicking their hidden triggers
    const handleOpenRouteListView = () => {
        routeListViewTriggerRef.current?.click();
    }

    const handleOpenCloneView = () => {
        cloneViewTriggerRef.current?.click();
    }

    if (!attachable && !linkable && !commentable && (context === "routers" || hasRouteResult)) return null;

    return (
        <>
            <Builder>
                <button
                    ref={routeListViewTriggerRef}
                    style={{ display: 'none' }}
                    aria-hidden="true"
                >
                    Open Builder
                </button>
            </Builder>

            <CloneView>
                <button
                    ref={cloneViewTriggerRef}
                    style={{ display: 'none' }}
                    aria-hidden="true"
                >
                    Open Clone View
                </button>
            </CloneView>

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
                        {context === "models" && !hasRouteResult && (
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <div className='flex items-center space-x-2'>
                                        <RouteIcon className='h-4 w-4' />
                                        <span>Add Route</span>
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault();
                                            handleOpenRouteListView();
                                        }}>
                                            <div className='flex items-center space-x-2'>
                                                <ListIcon className='h-4 w-4' />
                                                <span>From List View</span>
                                            </div>
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem>
                                            <div className='flex items-center space-x-2'>
                                                <HammerIcon className='h-4 w-4' />
                                                <span>From Builder View</span>
                                            </div>
                                        </DropdownMenuItem> */}
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault();
                                            handleOpenCloneView();
                                        }}>
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