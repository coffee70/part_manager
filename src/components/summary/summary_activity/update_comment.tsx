'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '@/server/comments/update_comment';
import { collectionKeys, commentKeys } from '@/lib/query_keys';
import { useURLMetadata } from '@/hooks/url_metadata.hook';

type Props = {
    comment: {
        _id: string;
        user: {
            name: string;
        };
        updatedAt: string;
        text: string;
    };
    children: React.ReactNode;
}

export default function UpdateComment({ comment, children }: Props) {
    const [value, setValue] = React.useState(comment.text);
    const [open, setOpen] = React.useState(false);

    const { collection, id } = useURLMetadata();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all(collection, id) });
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
            setOpen(false);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ modelId: id, collection, commentId: comment._id, text: value });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Edit comment</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
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