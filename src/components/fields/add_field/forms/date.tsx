'use client'
import React from 'react';
import Input from "./form_fields/input";
import Textarea from "./form_fields/textarea";
import { useAddFieldContext } from '../add_field.context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDateField } from '@/server/sections/create_field';
import { Button } from '@/components/ui/button';

type FormState = {
    sectionId: number;
    type: 'DATE';
    name: string;
    description: string;
}

export default function DateForm() {
    const { id, setOpen } = useAddFieldContext();

    const [formState, setFormState] = React.useState<FormState>({
        sectionId: id,
        type: 'DATE',
        name: '',
        description: '',
    })

    const queryClient = useQueryClient();
    
    const { mutate } = useMutation({
        mutationFn: createDateField,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields', 'customerOrders'] });
            setOpen(false);
        }
    })

    return (
        <form
            onSubmit={() => mutate(formState)}
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
            <Button
                className='w-full'
                type='submit'
            >Create</Button>
        </form>
    )
}