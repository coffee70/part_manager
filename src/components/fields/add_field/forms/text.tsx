'use client'
import React from 'react';
import Input from "./form_fields/input";
import Textarea from "./form_fields/textarea";
import { Button } from '@/components/ui/button';
import { useAddFieldContext } from '../add_field.context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTextField } from '@/server/sections/create_field';

type FormState = {
    sectionId: number;
    type: 'TEXT';
    name: string;
    description: string;
    default: string;
}

export default function TextForm() {
    const { id, setOpen } = useAddFieldContext();

    const [formState, setFormState] = React.useState<FormState>({
        sectionId: id,
        type: 'TEXT',
        name: '',
        description: '',
        default: ''
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createTextField,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields', 'customerOrders'] });
            setOpen(false);
        }
    });

    return (
        <form
            onSubmit={() => mutate(formState)}
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
            <Input
                label="Default Value"
                placeholder="Enter the default value"
                value={formState.default}
                onChange={(e) => setFormState(prev => ({ ...prev, default: e.target.value }))}
            />
            <Button
                className="w-full"
                type='submit'
            >Create</Button>
        </form>
    )
}