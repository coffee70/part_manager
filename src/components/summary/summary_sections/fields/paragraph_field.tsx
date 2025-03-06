'use client'
import React from 'react'
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
import { getFormClassName } from './field_helpers'

type Props = {
    field: Field & {
        value?: string | string[];
    };
}
export default function ParagraphField({ field }: Props) {
    const [value, setValue] = React.useState(field.value);

    React.useEffect(() => {
        setValue(field.value ?? '')
    }, [field.value])

    const { context, id, instanceId } = useInstanceURL();

    const submitRef = React.useRef<HTMLButtonElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (isEditing) textarea?.focus();
        else textarea?.blur();
    }, [isEditing]);

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            setIsEditing(false);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            id,
            instanceId,
            fieldId: field._id,
            value
        });
    }

    const handleBlur = (e: React.FocusEvent, target: HTMLElement | null) => {
        if (e.relatedTarget !== target) {
            setIsEditing(false);
        }
    }

    return (
        <form
            className={getFormClassName(isError, isPending, isEditing)}
            onSubmit={handleSubmit}
        >
            <Textarea
                id={field.name}
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsEditing(true)}
                onBlur={(e) => handleBlur(e, submitRef.current)}
            />
            <div className="flex flex-col">
                {isError ? (
                    <Error message={error.message} />
                ) : isPending ? (
                    <Loading />
                ) : isEditing ? (
                    <Editing
                        ref={submitRef}
                        onBlur={(e) => handleBlur(e, textareaRef.current)}
                        aria-label={`Save field ${field.name}`}
                    />
                ) : (
                    <NotEditing
                        onClick={() => setIsEditing(true)}
                        aria-label={`Edit field ${field.name}`}
                    />
                )}
            </div>
        </form>
    )
}