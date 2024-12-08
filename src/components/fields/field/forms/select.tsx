'use client'
import React from 'react';
import Input from "./form_fields/input";
import Textarea from "./form_fields/textarea";
import ButtonGroup from "@/components/ui/button_group";
import TagInput from "@/components/ui/tag_input";
import { Button } from '@/components/ui/button';
import { useFieldForm } from './use_field_form.hook';
import { Field, FieldType } from '@/types/collections';

type Props = {
    sectionId?: string;
    setOpen: (value: boolean) => void;
    field?: Field;
}

export default function SelectForm({ field, setOpen, sectionId }: Props) {

    const {
        formState,
        setFormState,
        mutate
    } = useFieldForm({
        initialState: {
            type: 'select',
            name: field?.name || '',
            sectionId: field?.sectionId || sectionId || '',
            description: field?.description || '',
            multiple: field?.multiple || false,
            creative: field?.creative || false,
            options: field?.options || []
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
                id='name'
                name='name'
                label="Field Name"
                placeholder="Enter the field name"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
                id="description"
                name="description"
                label="Description"
                placeholder="Enter the field description"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            />
            <ButtonGroup
                value={formState.multiple ? 'Multiple' : 'Single'}
                onChange={(newValue) => setFormState(prev => ({ ...prev, multiple: newValue === 'Multiple' }))}
                labels={['Single', 'Multiple']}
            />
            <ButtonGroup
                value={formState.creative ? 'Creative' : 'Restricted'}
                onChange={(newValue) => setFormState(prev => ({ ...prev, creative: newValue === 'Creative' }))}
                labels={['Restricted', 'Creative']}
            />
            <div className="flex flex-col">
                <span>Options</span>
                <TagInput
                    className='border border-muted-foreground p-1'
                    placeholder="Type an option and press enter"
                    value={formState.options}
                    onChange={(options) => setFormState(prev => ({ ...prev, options: options }))}
                />
            </div>
            <Button
                className="w-full"
                type='submit'
            >Save</Button>
        </form>
    )
}