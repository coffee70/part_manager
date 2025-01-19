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
import { updateFieldValue } from '@/server/fields/update_field_value'
import { instanceKeys, sectionKeys } from '@/lib/query_keys'
import { Field } from '@/types/collections'

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
    field: Field & {
        value?: string | string[];
    };
}
export default function ParagraphField({ field }: Props) {

    const [value, setValue] = React.useState(field.value);

    React.useEffect(() => {
        setValue(field.value)
    }, [field.value])

    const { modelId, instanceId } = useInstanceURL();

    const { isEditing, setIsEditing, textareaRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(modelId) })
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) });
            setIsEditing(false);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            modelId,
            instanceId,
            fieldId: field._id,
            value
        });
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
                        <Editing aria-label={`Save field ${field.name}`} />
                    ) : (
                        <NotEditing
                            onClick={() => setIsEditing(true)}
                            aria-label={`Edit field ${field.name}`}
                        />
                    )}
                </div>
            </form>
        </ClickAwayListener>
    )
}