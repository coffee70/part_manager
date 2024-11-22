'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'
import { Field } from '@/types/collections'
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { Input } from '@/components/ui/input'
import { useIsEditing } from './is_editing.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFieldValue } from '@/server/fields/update_field_value'
import { useURLMetadata } from '@/hooks/url_metadata.hook'
import { collectionKeys } from '@/lib/query_keys'

type FieldComponentProps = {
    type: React.InputHTMLAttributes<HTMLInputElement>['type'];
    value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
    onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
}

export const FieldComponent = React.forwardRef<HTMLInputElement, FieldComponentProps>((props, ref) => {
    return <Input className="no-icon" ref={ref} {...props} />
})

FieldComponent.displayName = 'FieldComponent'

type Props = {
    field: Field & {
        value?: string | string[];
    };
}

export default function InputField({ field }: Props) {
    const [value, setValue] = React.useState(field.value ?? '');

    React.useEffect(() => {
        setValue(field.value ?? '')
    }, [field.value])

    const { id, collection } = useURLMetadata();

    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) })
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            modelId: id,
            fieldId: field._id,
            sectionCollection: collection,
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
                <FieldComponent
                    ref={inputRef}
                    type={field.type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex flex-col">
                    {isError ? (
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

