'use client'
import React from 'react';
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
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
    value: string | string[] | undefined;
    isEditing: boolean;
    isError: boolean;
    isPending: boolean;
    error: Error | null;
    setIsEditing: (isEditing: boolean) => void;
    setValue: (value: string | string[] | undefined) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SelectField({
    field,
    value,
    isEditing,
    isError,
    isPending,
    error,
    setIsEditing,
    setValue,
    handleSubmit
}: Props) {

    const submitRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const input = inputRef.current;
        if (isEditing) input?.focus();
        else input?.blur();
    }, [isEditing]);

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
                    <Error message={error?.message || 'An error occurred'} />
                ) : isPending ? (
                    <Loading />
                ) : isEditing ? (
                    <Editing
                        ref={submitRef}
                        onBlur={(e) => handleBlur(e, inputRef.current)}
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