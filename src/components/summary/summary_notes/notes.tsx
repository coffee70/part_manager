'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { Textarea } from '@/components/ui/textarea'
import { useInstanceURL } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { instanceKeys } from '@/lib/query_keys'
import { updateNotes } from '@/server/notes/update_notes'

function useIsEditing() {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            textareaRef.current?.focus()
            textareaRef.current?.select()
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

    /** 
     * updating using the form will not cause the notes
     * to re-render with the new initialValue so we need to
     * update the value when the initialValue changes
     */
    // TODO: find a better way to handle this
    React.useEffect(() => {
        setValue(initialValue ?? '')
    }, [initialValue])

    const [value, setValue] = React.useState(initialValue ?? '');

    const { context, id, instanceId } = useInstanceURL();

    const { isEditing, setIsEditing, textareaRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instanceKeys.id(context, id, instanceId) })
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) })
            setIsEditing(false);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            id,
            instanceId,
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
                    id='summary-notes'
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
                        <NotEditing onClick={() => setIsEditing(true)} />
                    )}
                </div>
            </form>
        </ClickAwayListener>
    )
}