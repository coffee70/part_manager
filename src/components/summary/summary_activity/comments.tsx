'use client'
import React from 'react';
import CreateComment from './create_comment';
import { useQuery } from '@tanstack/react-query';
import { commentKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { getComments } from '@/server/comments/get_comments';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Comment from './comment';


export default function Comments() {

    const { context, id, instanceId } = useInstanceURL();

    const { data, isPending, isError } = useQuery({
        queryKey: commentKeys.all(context, id, instanceId),
        queryFn: () => getComments({ context, id, instanceId }),
    })

    return (
        <>
            <div className="flex flex-col space-y-2">
                {isPending ? (
                    <div className='border-b border-b-foreground h-14'>Loading...</div>
                ) : isError || !data ? (
                    <>
                        <Alert variant='destructive'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Could not retrieve comments.</AlertDescription>
                        </Alert>
                        <div className='border-b border-b-foreground h-3'></div>
                    </>
                ) : data.comments.length === 0 ? (
                    <div className='border-b border-b-foreground h-14'>No comments yet</div>
                ) : (
                    <>
                        {data.comments.map(comment => (
                            <Comment key={comment._id} comment={comment} />
                        ))}
                        <div className='border-b border-b-foreground h-3'></div>
                    </>
                )}
                <CreateComment />
            </div>
        </>
    )
}