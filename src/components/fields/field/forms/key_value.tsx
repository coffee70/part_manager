'use client'
import React from 'react';
import ButtonGroup from "@/components/ui/button_group";
import { FieldFormState } from '@/lib/fields';
import { upsertField } from '@/server/fields/upsert_field';
import { Input } from '@/components/ui/fields/input';
import { Textarea } from '@/components/ui/fields/textarea';
import TagInput from '@/components/ui/fields/tag_input';

type Props = {
    formState: FieldFormState;
    setFormState: React.Dispatch<React.SetStateAction<FieldFormState>>;
    data?: Awaited<ReturnType<typeof upsertField>>;
}

export default function KeyValueForm({ formState, setFormState, data }: Props) {
    return (
        <>
            <Input
                name='name'
                label="Field Name"
                placeholder="Enter the field name"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                error={data?.fieldErrors?.name}
            />
            <Textarea
                name="description"
                label="Description"
                placeholder="Enter the field description"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                error={data?.fieldErrors?.description}
            />
            <ButtonGroup
                value={formState.multiple ? 'Multiple' : 'Single'}
                onChange={(newValue) => setFormState(prev => ({ ...prev, multiple: newValue === 'Multiple' }))}
                labels={['Single', 'Multiple']}
            />
            <TagInput
                label='Keys'
                placeholder="Type a key and press Enter..."
                value={formState.keys}
                onChange={(keys) => setFormState(prev => ({ ...prev, keys }))}
                error={data?.fieldErrors?.keys}
            />
        </>
    )
}