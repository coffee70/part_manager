'use client'
import React from 'react';
import { FieldFormState } from '../field_form';
import { upsertField } from '@/server/fields/upsert_field';
import { Input } from '@/components/ui/fields/input';
import { Textarea } from '@/components/ui/fields/textarea';

type Props = {
    formState: FieldFormState;
    setFormState: React.Dispatch<React.SetStateAction<FieldFormState>>;
    data?: Awaited<ReturnType<typeof upsertField>>;
}

export default function TextForm({ formState, setFormState, data }: Props) {
    return (
        <>
            <Input
                label="Field Name"
                placeholder="Enter the field name"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                error={data?.fieldErrors?.name}
            />
            <Textarea
                label="Description"
                placeholder="Enter the field description"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                error={data?.fieldErrors?.description}
            />
            <Input
                label="Default Value"
                placeholder="Enter the default value"
                value={formState.default}
                onChange={(e) => setFormState(prev => ({ ...prev, default: e.target.value }))}
                error={data?.fieldErrors?.default}
            />
        </>
    )
}