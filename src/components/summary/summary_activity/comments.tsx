'use client'
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import ActionButtons from './action_buttons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/server/comments/create_comment';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { collectionKeys } from '@/lib/query_keys';
import { useUser } from '@/hooks/user.hook';
import CreateComment from './create_comment';

export default function Comments() {

    return (
        <>
            <div className="flex flex-col space-y-2">
                <span>There are no comments yet.</span>
                <div className='border-b border-b-foreground h-6'></div>
                <CreateComment />
            </div>
        </>
    )
}