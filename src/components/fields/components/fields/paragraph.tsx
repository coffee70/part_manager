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
import { updateFieldValue } from '@/server/fields/update_field_value'
import { collectionKeys } from '@/lib/query_keys'
import { Field } from '@/types/collections'

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
    field: Field & {
        value?: string | string[];
    };
}
export default function ParagraphField({ field }: Props) {

    const [value, setValue] = React.useState(field.value);

    React.useEffect(() => {
        setValue(field.value)
    }, [field.value])

    const { id, collection } = useURLMetadata();

    const { isEditing, setIsEditing, textareaRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) })
        }
    })

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <div className={cn(
                "group relative flex justify-between border border-transparent pl-1",
                isError ? "border-red-500" :
                    isPending ? "border-foreground" :
                        isEditing ? "border-foreground" : "hover:border-foreground",
            )}
                onSubmit={() => mutate({
                    modelId: id,
                    fieldId: field._id,
                    sectionCollection: collection,
                    value
                })}
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
            </div>
        </ClickAwayListener>
    )
}