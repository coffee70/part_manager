'use client'
import React from 'react';
import Input from "./form_fields/input";
import Textarea from "./form_fields/textarea";
import { useAddFieldContext } from '../../context/add_field.context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createParagraphField } from '@/server/fields/create_field';
import { Button } from '@/components/ui/button';

type FormState = {
    sectionId: number,
    type: 'PARAGRAPH',
    name: string,
    description: string
};

export default function ParagraphForm() {
    const { id, setOpen } = useAddFieldContext();

    const [formState, setFormState] = React.useState<FormState>({
        sectionId: id,
        type: 'PARAGRAPH',
        name: '',
        description: '',
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createParagraphField,
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
            <Button
                className='w-full'
                type="submit"
            >Create</Button>
        </form>

    )
}