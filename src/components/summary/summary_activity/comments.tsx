'use client'
import React from 'react';
import CreateComment from './create_comment';
import { useQuery } from '@tanstack/react-query';
import { commentKeys } from '@/lib/query_keys';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { getComments } from '@/server/comments/get_comments';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatDate } from '@/lib/date';

export default function Comments() {

    const { collection, id } = useURLMetadata();

    const { data, isPending, isError } = useQuery({
        queryKey: commentKeys.all(collection, id),
        queryFn: () => getComments({ collection, id }),
    })

    console.log(data)

    return (
        <>
            <div className="flex flex-col space-y-2">
                {isPending ? (
                    <div>Loading...</div>
                ) : isError || !data ? (
                    <Alert variant='destructive'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Could not retrieve comments.</AlertDescription>
                    </Alert>
                ) : data.comments.length === 0 ? (
                    <div>No comments yet</div>
                ) : data.comments.map(comment => (
                    <div key={comment._id} className='flex flex-col space-y-2 border-t border-foreground'>
                        <div className='text-sm text-muted-foreground'>{comment.user.name} commented {formatDate(comment.updatedAt).toLowerCase()}</div>
                        <div className='text-sm'>{comment.text}</div>
                    </div>
                ))}
                <div className='border-b border-b-foreground h-6'></div>
                <CreateComment />
            </div>
        </>
    )
}