'use client'
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createField } from '@/server/fields/create_field';
import { updateField } from '@/server/fields/update_field';
import { Create, Field, FieldType } from '@/types/collections';
import { useFieldURL } from '@/hooks/url_metadata.hook';
import { sectionKeys } from '@/lib/query_keys';

type Props<T extends Create<Field>> = {
    setOpen: (value: boolean) => void;
    initialState: T;
    field?: {
        _id: string;
        name: string;
        sectionId: string;
        type: FieldType;
        description: string;
        multiple?: boolean;
        creative?: boolean;
        default?: string;
        options?: string[];
    }
}

export function useFieldForm<T extends Create<Field>>(props: Props<T>) {

    const { setOpen, initialState, field } = props;

    const [formState, setFormState] = React.useState<T>(initialState)

    const { modelId } = useFieldURL();

    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: sectionKeys.all(modelId) });
        setOpen(false);
    }

    const { mutate: create } = useMutation({
        mutationFn: createField,
        onSuccess: onSuccess
    })

    const { mutate: update } = useMutation({
        mutationFn: updateField,
        onSuccess: onSuccess
    })

    const mutate = () => {
        field ? update({ _id: field._id, field: formState }) : create({ field: formState })
    }

    return {
        formState,
        setFormState,
        mutate
    }
}