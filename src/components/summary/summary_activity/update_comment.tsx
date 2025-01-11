'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '@/server/comments/update_comment';
import { commentKeys, instanceKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PencilIcon } from "lucide-react";

type Props = {
    comment: {
        _id: string;
        user: {
            name: string;
        };
        updatedAt: string;
        text: string;
    };
}

export default function UpdateComment({ comment }: Props) {
    const [value, setValue] = React.useState(comment.text);
    const [open, setOpen] = React.useState(false);

    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate, error, isError } = useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all(modelId, instanceId) });
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) });
            setOpen(false);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ modelId, instanceId, commentId: comment._id, text: value });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary'
                >
                    <PencilIcon className='h-3 w-3' />
                    <span>Edit</span>
                </button>
            </DialogTrigger>
            <DialogContent className="min-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Edit comment</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                {isError && <Alert variant='destructive'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <Textarea
                        className="border border-border p-1"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <Button type="submit">Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}