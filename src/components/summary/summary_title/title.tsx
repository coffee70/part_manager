'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { useURLMetadata } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionKeys } from '@/lib/query_keys'
import { Input } from '@/components/ui/input'
import { updateTitle } from '@/server/title/update_title'

function useIsEditing() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
        }
    }, [isEditing])

    React.useEffect(() => {
        const _textareaRef = inputRef.current;
        _textareaRef?.addEventListener('focus', () => setIsEditing(true))

        return () => {
            _textareaRef?.removeEventListener('focus', () => setIsEditing(false))
        }
    })

    return {
        inputRef,
        isEditing,
        setIsEditing,
    }
}

type Props = {
    initialValue?: string;
    titleKey: string;
}

export default function Title({ initialValue, titleKey }: Props) {

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

    const { id, collection } = useURLMetadata();

    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateTitle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) })
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection)})
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            id,
            collection,
            key: titleKey,
            title: value
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
                <Input
                    ref={inputRef}
                    className='text-3xl font-bold'
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