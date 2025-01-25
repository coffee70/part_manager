'use client'
import React from 'react';
import { ClickAwayListener } from "@mui/base";
import { cn } from "@/lib/utils";
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { useIsEditing } from "./is_editing.hook";
import { Combobox } from "@/components/ui/combobox/combobox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFieldValue } from "@/server/fields/update_field_value";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { instanceKeys, sectionKeys } from '@/lib/query_keys';
import { Field } from '@/types/collections';
import { getFormClassName } from './field_helpers';

type Props = {
    field: Field & {
        value?: string | string[];
    };
}

export default function SelectField({ field }: Props) {
    const [value, setValue] = React.useState(field.value);

    React.useEffect(() => {
        setValue(field.value);
    }, [field.value]);

    const { modelId, instanceId } = useInstanceURL();

    const submitRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        const input = inputRef.current;
        if (isEditing) input?.focus();
        else input?.blur();
    }, [isEditing]);

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(modelId) });
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
            <Combobox
                id={field.name}
                ref={inputRef}
                options={field.options || []}
                value={value}
                onChange={(v) => setValue(v)}
                multiple={field.multiple}
                creative={field.creative}
                onFocus={() => setIsEditing(true)}
                onBlur={(e) => handleBlur(e, submitRef.current)}
            />
            <div className="flex flex-col h-full">
                {isError ? (
                    <Error message={error.message} />
                ) : isPending ? (
                    <Loading />
                ) : isEditing ? (
                    <Editing
                        ref={submitRef}
                        onBlur={(e) => handleBlur(e, submitRef.current)}
                        aria-label={`Save field ${field.name}`} />
                ) : (
                    <NotEditing
                        onClick={() => setIsEditing(true)}
                        aria-label={`Edit field ${field.name}`}
                    />
                )}
            </div>
        </form>
    );
}