'use client'
import React from 'react';
import Input from "./form_fields/input";
import Textarea from "./form_fields/textarea";
import { Button } from '@/components/ui/button';
import { useFieldForm } from './use_field_form.hook';
import { Field, FieldType } from '@/types/collections';

type Props = {
    sectionId?: string;
    setOpen: (value: boolean) => void;
    field?: Field;
}

export default function ParagraphForm({ field, sectionId, setOpen }: Props) {

    const {
        formState,
        setFormState,
        mutate
    } = useFieldForm({
        initialState: {
            type: 'paragraph',
            name: field?.name || '',
            sectionId: field?.sectionId || sectionId || '',
            description: field?.description || ''
        },
        field: field,
        setOpen: setOpen
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col space-y-4'
        >
            <Input
                label="Field Name"
                placeholder="Enter the field name"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
                label="Description"
                placeholder="Enter the field description"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            />
            <Button
                className='w-full'
                type="submit"
            >Save</Button>
        </form>

    )
}