'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'
import Error from './error'
import Loading from './loading'
import Editing from './editing'
import NotEditing from './not_editing'
import { Textarea } from '@/components/ui/textarea'
import { useURLMetadata } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionKeys } from '@/lib/query_keys'
import { updateNotes } from '@/server/notes/update_notes'

function useIsEditing() {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            textareaRef.current?.focus()
        }
    }, [isEditing])

    React.useEffect(() => {
        const _textareaRef = textareaRef.current;
        _textareaRef?.addEventListener('focus', () => setIsEditing(true))

        return () => {
            _textareaRef?.removeEventListener('focus', () => setIsEditing(false))
        }
    })

    return {
        textareaRef,
        isEditing,
        setIsEditing,
    }
}

type Props = {
    initialValue?: string;
}

export default function Notes({ initialValue }: Props) {

    const [value, setValue] = React.useState(initialValue ?? '');

    const { id, collection } = useURLMetadata();

    const { isEditing, setIsEditing, textareaRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) })
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            id,
            collection,
            notes: value
        })
    }

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <form className={cn(
                "group relative flex justify-between border border-transparent pl-1",
                isError ? "border-red-500" :
                    isPending ? "border-foreground" :
                        isEditing ? "border-foreground" : "hover:border-foreground",
            )}
                onSubmit={handleSubmit}
            >
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex flex-col">
                    {error ? (
                        <Error message={error.message} />
                    ) : isPending ? (
                        <Loading />
                    ) : isEditing ? (
                        <Editing />
                    ) : (
                        <NotEditing setIsEditing={setIsEditing} />
                    )}
                </div>
            </form>
        </ClickAwayListener>
    )
}